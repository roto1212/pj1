// import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
function Header(props) {
  // console.log('props',props);
  return (
  <header>
    <h1><a href="/" onClick={(event)=>{event.preventDefault();props.onChangeMode()}}>{props.title}</a></h1>
  </header>
  );
}
function Nav(props) {
  let lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    const topic = props.topics[i];
    let $li = <li key={topic.id}>
      <a id={topic.id} href={`/read/${topic.id}`} onClick={(event)=>{event.preventDefault();props.onChangeMode(Number(event.target.id));}}>{topic.title}</a>
    </li>;
    lis = [...lis, $li];
  }
  return(
    <nav>
      <ol>
        {lis}
        <li>
          <button href="/create" onClick={event=> {
            event.preventDefault();
            let mode = 'CREATE';
            props.setMode(mode);
          }}>Create</button>
        </li>
      </ol>
    </nav>
  )
}
function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}
function Create(props) {
  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}> 
        <p>
          <input type="text" name="title" id="" placeholder='TITLE' />
        </p>
        <p>
          <textarea name="body" placeholder='BODY'></textarea>
        </p>
        <p>
          <button type="submit">Create</button>
        </p>
      </form>
    </article>
  )
}
function Update(props) {
  // props 로 받은 값을 변경하려면 state로 변화하여 수정해야 한다.
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}> 
        <p>
          <input type="text" name="title" id="" placeholder='TITLE' value={title} onChange={event=>{
            setTitle(event.target.value);
          }} />
        </p>
        <p>
          <textarea name="body" placeholder='BODY' value={body} onChange={event=>{
            setBody(event.target.value);
          }}></textarea>
        </p>
        <p>
          <button type="submit">Update</button>
        </p>
      </form>
    </article>
  )
}
function App() {
  let [mode, setMode] = useState("WELCOME");
  let [topicId, setTopicId] = useState(null);
  const [nextTopicId, setNextTopicId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'},
  ]);
  let topic = topics.filter((row) => row.id === topicId)[0] ?? {id:null, title:"Welcome", body:'Hello, WEB'};
  let content = {
    WELCOME: <Article title="Welcome" body="Hello, WEB"/>,
    READ: <>
      <Article title={topic.title} body={topic.body}/>
      <a href={`/update/${topic.id}`} onClick={(event) => {
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a>
      <button onClick={() => {
        const newTopics = topics.filter(oldTopic => topic.id !== oldTopic.id);
        setTopics([...newTopics]);
        setMode('WELCOME');
      }}>Delete</button>
    </>,
    CREATE:<Create onCreate={(title, body) => {
      setTopics([...topics, {id:nextTopicId, title, body}]);
      setMode('READ');
      setTopicId(nextTopicId);
      setNextTopicId(nextTopicId+1);
    }}></Create>,
    UPDATE: <Update title={topic.title} body={topic.body} onUpdate={(title, body) => {
      topic.title = title;
      topic.body = body;
      setTopics([...topics]);
      setMode('READ');
    }}></Update>
  };
  return (
    <div className="App">
      <Header title="WEB" onChangeMode={() => {
        setMode('WELCOME');
        setTopicId(null);
      }}/>
      <Nav topics={topics} setMode={setMode} onChangeMode={(navId) => {
        setMode('READ');
        setTopicId(navId);
      }}/>
      {content[mode]}
    </div>
  );
}

export default App;
