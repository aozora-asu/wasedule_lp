interface EmailTemplateProps {
  name: string;
  subject: string;
  email: string;
  body: string;
}

export const EmailTemplate = ({ name, subject, email, body }: EmailTemplateProps) => (
  <div
    style={{
      backgroundColor: "#f9fafb",
      padding: "16px",
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
      color: "#111827",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        maxWidth: "768px",
        margin: "0 auto",
      }}
    >
      <div style={{ padding: "32px 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <img
            src="https://wasedule.com/static-assets/wasedule_icon.png"
            width={36}
            height={36}
            alt="わせジュール"
          />
        </div>
        <h1
          style={{
            margin: "0 0 4px 0",
            fontSize: "24px",
            lineHeight: "32px",
            fontWeight: 600,
          }}
        >
          お問い合わせを受け付けました
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: "22px",
            color: "#111827",
          }}
        >
          お問い合わせいただきありがとうございます。
          <br />
          可能な限り早めにご対応いたしますが、お返事にはお時間をいただく場合があります。
        </p>
      </div>

      <div style={{ padding: "0 24px" }}>
        <h2
          style={{
            margin: "0 0 8px 0",
            fontSize: "18px",
            lineHeight: "28px",
            fontWeight: 600,
          }}
        >
          受け付け内容
        </h2>
        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "12px",
            lineHeight: "18px",
            color: "#6b7280",
          }}
        >
          今回お問い合わせいただいた内容です。
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  fontWeight: 600,
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                  width: "140px",
                }}
              >
                項目
              </th>
              <th
                style={{
                  textAlign: "left",
                  fontWeight: 600,
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                }}
              >
                内容
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                  fontWeight: 600,
                  width: "140px",
                  whiteSpace: "nowrap",
                }}
              >
                お名前
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                }}
              >
                {name}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                  fontWeight: 600,
                  width: "140px",
                  whiteSpace: "nowrap",
                }}
              >
                メールアドレス
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                }}
              >
                {email}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                  fontWeight: 600,
                  width: "140px",
                  whiteSpace: "nowrap",
                }}
              >
                件名
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                }}
              >
                {subject}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                  fontWeight: 600,
                  width: "140px",
                  whiteSpace: "nowrap",
                }}
              >
                お問い合わせ内容
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                }}
              >
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{body}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "32px 16px",
          gap: "32px",
        }}
      >
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "80rem",
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <div>
            <img
              src="https://wasedule.com/static-assets/aozora-studio_logo.png"
              width={200}
              alt="Aozora Studio"
            />
            <p
              style={{
                textAlign: "left",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#9ca3af", // gray-400
                paddingLeft: "12px",
                paddingRight: "12px",
                margin: "8px 0 0",
              }}
            >
              Created and developed only by waseda students. <br />
              No other company, organization, or Waseda University is related.
            </p>
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 600,
              textAlign: "end",
              padding: "12px",
              color: "#4b5563", // gray-600
              width: "-webkit-fill-available",
            }}
          >
            © 2025 Aozora Studio
          </p>
        </section>
      </footer>
    </div>
  </div>
);
