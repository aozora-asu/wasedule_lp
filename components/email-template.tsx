interface EmailTemplateProps {
  name: string;
  email: string;
  body: string;
}

export const EmailTemplate = ({ name, email, body }: EmailTemplateProps) => (
  <div>
    <table>
      <tbody>
        <tr>
          <th scope="row">name</th>
          <td>{name}</td>
        </tr>
        <tr>
          <th scope="row">email</th>
          <td>{email}</td>
        </tr>
      </tbody>
    </table>
    <p>{body}</p>
  </div>
);
