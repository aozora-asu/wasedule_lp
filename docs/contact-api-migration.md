# アプリのお問い合わせAPI移行

新規ルートをローカル実装した段階。**未デプロイ・本番未有効化**。Flutter側の.env非同梱と残存するLegacyキーの移行も別途必要。

## 新旧ルート

- 旧: `POST /api/app/contact`。既存の `APP_API_SECRET` と `x-api-key`、JSONを維持する。秘密未設定時は503にして受付を停止する。401は従来どおり。内部エラーや配送サービスのレスポンスを返さない。
- 新: `POST /api/app/v2/contact`。アプリに配る固定秘密は不要。設定・信頼するIP・Redisが利用できないと503にする。`CONTACT_PUBLIC_API_ENABLED=true` にするだけでは、他の必須設定がない限り利用できない。
- 旧ルートの固定鍵には既に秘匿性を期待できない。共存期間中の旧ルートにもWAFでのレート・サイズ・費用制限を適用する。新ルートのRedis制限だけで旧ルートを保護できたとは扱わない。

## 入力と結果

Content-Typeはapplication/json、UTF-8。bodyは64KiB以下（Content-Lengthの申告だけでなくstreamも検査）。読み込みは3秒で打ち切る。不正JSON/型/未知フィールド/改行によるヘッダー注入/空文字を拒否する。新ルートのJSONはFlutterと同じ6項目。

| フィールド | trim後のUTF-16コード単位の上限・条件 |
| --- | --- |
| name | 1〜200、改行不可 |
| email | 1〜254、Flutterと同等のメール形式 |
| subject | 1〜200、改行不可 |
| body | 20〜10,000 |
| sentFrom | app固定。認証の根拠にはしない |
| userEnv | 1〜4,000 |

成功時200で `{"success":true}`。型・形式400、サイズ413、Content-Type415、読み込みtimeout408、制限・重複429 + Retry-After、設定・制限基盤・配送失敗503。応答はno-store。CORS・User-Agent・sentFrom・固定秘密を本人性の根拠にしない。アプリに外部サービスの秘密を返さない。

新ルートもmicroCMS保存、Spreadsheet保存、Discord通知を行う。Discordは2,000文字へ省略し、保存内容は省略しない。**メール所有を確認できない匿名ルートから、入力アドレスへの自動返信は送らない**。運営側は保存した連絡先を見て通常の返信を行える。旧ルートとWebの自動返信は維持する。共有処理の外部レスポンスをログへ出す記述を除去した。

処理timeoutは20秒、Vercel maxDurationは30秒。複数の外部I/Oに対するトランザクション/永続キューはまだないため、一部保存後に503になる可能性がある。20秒超過時も外部I/Oのキャンセルは保証されない。即時再送を避けるため、重複予約は失敗時にも残す。完全なexactly-once配送や再試行キューは未実装。

## 共有制限

Upstash互換Redis RESTのEVALで、検査と予約を原子的に実行する。メモリ内の制限へフォールバックしない。時刻はRedis TIMEを使用する。

- IPネットワーク: 最初の受付から10分で5件、24時間で20件。
- 小文字化したメール: 最初の受付から1時間で3件。メールは本人性の証明ではない。
- 全体: 最初の受付から24時間で1,000件。同時処理10件まで。カレンダー日境界ではなくTTL窓。
- メール・件名・本文が同じ要求: 10分間は重複として拒否する。名前や端末情報だけ変えても回避できない。
- IP、メール、本文はサーバーHMACを通した値だけをRedisへ格納する。カウンターの最大保持は24時間、同時処理leaseは120秒。タイムアウト時はleaseを直ちに解放しない。
- IPv4とIPv4-mapped IPv6を同一視し、IPv6は/64で集約する。大学・共有回線での誤制限やIPv6の影響はステージングで評価する。
- IPは **Vercel上の関数に限り** `x-vercel-forwarded-for` を使い、一般の `x-forwarded-for` にはフォールバックしない。複数IP・無効な値は拒否する。別のホスティングに移す場合は信頼proxyの保証を実装し直す。

外部からの大量不正JSON等は配送制限より前に拒否するため、入口のWAF/CDNレート制限、サイズ制限、DDoS対策、費用上限・通知は運用側でも必須。分散攻撃はIPやメールを変えられ、全体の上限を消費して正規ユーザーを妨害できる。追加のチャレンジ/App Checkを採用しても単独の認証・濫用防止とはしない。

## サーバー専用設定

| 変数 | 管理・条件 |
| --- | --- |
| CONTACT_PUBLIC_API_ENABLED | 既定false。運用設定・試験完了後true |
| UPSTASH_REDIS_REST_URL | HTTPSのサーバー接続先。userinfo/query/fragment不可 |
| UPSTASH_REDIS_REST_TOKEN | Redisへの書込権限を持つサーバー秘密 |
| CONTACT_RATE_LIMIT_HMAC_KEY | 32文字以上のランダムなサーバー秘密。実値をアプリ・ログ・PRへ書かない |
| VERCEL / VERCEL_ENV | Vercelが設定する実行環境。別ホストで偽装して有効化しない |
| MICROCMS_DOMAIN / MICROCMS_API_KEY | 既存の保存先。書込キーをクライアントへ渡さない |
| GAS_SCRIPT_URL / GAS_SECRET_TOKEN | 既存のSpreadsheet連携。サーバーのみ |
| DISCORD_WEBHOOK_URL | 既存の運営通知。サーバーのみ |
| APP_API_SECRET | 共存期間中の旧アプリ用。既に公開されたものとして扱い、失効計画を立てる |
| RESEND_API_KEY / CONTACT_EMAIL_FROM等 | 旧ルート/Webの既存自動返信用。新ルートでは入力宛先へ配送しない |

preview/productionはRedisキーのnamespaceを分ける。複数productionインスタンスで同じRedisとHMACを使い、同じ上限を共有する。Redisはno-eviction・永続化を設定し、カウンターの消失・再作成で予算制限がリセットされる点を監視する。HMACやRedisのローテーション時も上限がリセットされるため、期間中の切替・悪用を管理する。

## デプロイ順序と解除条件

1. RedisとサーバーSecretsを用意する。Vercel/信頼proxyの実態を確認する。旧新両方のWAF制限、配送費用上限と通知、エラー/429監視、個人情報の保持・閲覧権限を設定する。
2. 旧ルートの `APP_API_SECRET` を維持したまま新コードを配置する。新APIはfalseでデプロイし、旧アプリの成功・認証失敗を確認する。
3. ステージングで新APIを有効化し、下記テストと実際の保存・通知を確認する。Redis停止時503、転送IP偽装、並列制限、重複、長文、個人情報や秘密の非記録を確認する。新しい入力上限・自動返信の変更をレビューする。
4. 本番新APIを有効化し、成功率・429・外部費用を監視する。公開URL・実施者・実施日時・試験結果をFlutter側の移行記録へ残す。
5. FlutterのDIを新URLへ切り替える。旧APIへの自動フォールバックは設けない。アプリの.env同梱を廃止する。求人・microCMSなど他のキー依存も解消してから、実APK/AAB/IPAの非同梱を確認する。
6. アプリを配布する。旧ルートの利用状況とサポート対象バージョンを確認して、旧秘密を失効・上流秘密をローテーションし、旧ルートを停止する。新しい秘密を旧アプリへ再度配らない。

本変更では外部環境の設定、デプロイ、鍵のローテーション、既存.envの変更、アプリの本番DI切替は行っていない。ローカル実装・テスト成功だけでは本番で保護できたことにはならない。

## テスト

```sh
npm run test:contact
npx tsc --noEmit --incremental false
npx eslint lib/contact-api app/api/app/contact/route.ts app/api/app/v2/contact/route.ts lib/contact.ts lib/discord.ts lib/google-apps-script.ts actions/contactForm.ts test/contact-api
```

テストは実際の秘密・配送先を使わず外部I/Oを差し替える。13件で成功、設定不備、入力不正、サイズ、timeout、IP検証、429、Redis障害、配送失敗、旧契約互換・エラー非公開、長文通知でのOS・アプリバージョン保持と絵文字の安全な省略を検証する。

Luaの検証には隔離したRedisをUnix socketで起動して以下を実行する。production Redisへ向けない。自動テストはランダムなtest namespaceだけを使用し、FLUSHDBは実行しない。

```sh
CONTACT_TEST_REDIS_SOCKET=/path/to/test-redis.sock CONTACT_TEST_REDIS_CLI=/path/to/redis-cli npm run test:contact:redis
```

50並列のIP制限、メール制限、IP日次・全体日次上限、重複抑止、同時実行とlease回収の5件を実Redisで確認する。Upstash RESTの本番接続とVercelでの疎通は別途必要。

参照: [Vercelの転送ヘッダー](https://vercel.com/docs/headers/request-headers)、[Upstash REST](https://upstash.com/docs/redis/features/restapi)、[Redis Lua](https://redis.io/docs/latest/develop/programmability/eval-intro/)。
