import { Hono, type Context } from "hono"
import { css, Style } from "hono/css"
import { getById, getByName, type Hospital } from "./api.ts"

const app = new Hono()

function List(props: { hospitals: Hospital[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>住所</th>
          <th>電話番号</th>
          <th>医師数</th>
          <th>管理者</th>
          <th>種別</th>
          <th>状態</th>
          <th>診療科</th>
          <th>ベッド数</th>
        </tr>
      </thead>
      <tbody>
      {props.hospitals.map((hosp: Hospital) =>
        <tr>
          <td>{`${hosp.ken_code}${hosp.ten_code}${hosp.id}`}</td>
          <td>{hosp.name}</td>
          <td>{`${hosp.zip}\n${hosp.address}`}</td>
          <td>{hosp.tel}</td>
          <td>{hosp.dr_count.replaceAll(",", "\n")}</td>
          <td>{hosp.boss}</td>
          <td>{hosp.type}</td>
          <td>{hosp.status}</td>
          <td style="max-width: 30rem">{hosp.dept}</td>
          <td>{hosp.bed.replaceAll(",", "\n")}</td>
        </tr>
      )}
      </tbody>
    </table>
  );
}

function Top(props: { children: unknown }) {
  const styles = css`
    table{
      border: 1px solid black;
      border-collapse: collapse;
      width: 100%;
      & tbody tr:nth-child(even){
        background-color: #eeeeee;
      }
      & thead{
        text-align: center;
      }
      & tbody{
        white-space: pre-wrap;
        vertical-align: top;
      }
      & td, th{
        border: 1px solid black;
        border-collapse: collapse;
        padding: 3px;
      }
      & th{
        background-color: #cfffd1;
      }
    }
    label{
      margin-left: 5px;
    }
    input{
      padding: 3px;
      border-radius: 5px;
    }
    button{
      margin-left: 5px;
      font-size: 0.7rem;
      padding: 3px;
      border-radius: 3px;
    }
  `
  return (
    <html lang="ja-jp">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Style />
      </head>
      <body class={styles}>
        { props.children }
      </body>
    </html>
  );
}

function Input() {
  return (
    <form>
      <label>
      ID:
        <input id="id" type="text" value=""
        onkeydown="if(arguments[0].key==='Enter')location.href='/id/'+document.getElementById('id').value"/>
      </label>
      <button type="button" onclick="location.href='/id/'+document.getElementById('id').value">検索</button>
      <label>
      名称:
        <input id="name" type="text" value=""
          onkeydown="if(arguments[0].key==='Enter')location.href='/name/'+document.getElementById('name').value"/>
      </label>
      <button type="button" onclick="location.href='/name/'+document.getElementById('name').value">検索</button>
    </form>
  )
}

app.get("/", (c: Context) => {
  return c.html(
    <Top>
      <Input />
    </Top>
  );
});
app.get("/id/", (c: Context) => {
  return c.redirect("/");
});
app.get("/name/", (c: Context) => {
  return c.redirect("/");
});

app.get("/id/:id", (c: Context) => {
  const id = c.req.param("id");
  let res: Hospital[] = [];
  if(id){
    res = getById(id);
  }
  return c.html(
    <Top>
      <Input />
      <List hospitals={res} />
    </Top>
  );
});

app.get("/name/:name", (c: Context) => {
  const name = c.req.param("name");
  let res: Hospital[] = [];
  if(name){
    res = getByName(name);
  }
  return c.html(
    <Top>
      <Input />
      <List hospitals={res} />
    </Top>
  );
});

export default app