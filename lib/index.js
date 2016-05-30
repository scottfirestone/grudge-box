const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./data-store');

class GrudgeBox extends React.Component {
  constructor() {
    super();
    this.state = {
      grudges: store.all(),
    };
  }

  componentDidMount() {
    store.on('change', grudges => {
      this.setState({ grudges });
    });
  }

  render() {
    const activeGrudge = this.state.grudges.find(grudge => grudge.active);

    return (
      <div className="GrudgeBox">
        <section className="sidebar">
          <header>
            <h1>{this.props.title}</h1>
            <CreateGrudge/>
            <GrudgesList grudges={this.state.grudges}/>
          </header>
        </section>
        <section className="main-content">
          <ActiveGrudge grudge={activeGrudge}/>
        </section>
      </div>
    );
  }
}

class CreateGrudge extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      body: '',
    };
  }

  updateProperties(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  createGrudge(e) {
    e.preventDefault();
    store.create(this.state);
    this.setState({ title: '', body: ''});
  }

  render() {
    return (
      <div className="CreateGrudge">
        <input className="CreateGrudge-title"
               name="title"
               placeholder="Title"
               value={this.state.title}
               onChange={(e) => this.updateProperties(e)}
        />
        <textarea className="CreateGrudge-body"
                  name="body"
                  placeholder="Body"
                  value={this.state.body}
                  onChange={(e) => this.updateProperties(e)}
        />
        <input className="CreateGrudge-submit"
               type="submit"
               onClick={(e) => this.createGrudge(e)}
        />
      </div>
    );
  }
}

const GrudgesList = ({ grudges }) => {
  return (
    <div className="GrudgesList">
      {grudges.map(grudge => <GrudgesListItem {...grudge} key={grudge.id}/>)}
    </div>
  );
};

const GrudgesListItem = ({ id, title, body, active }) => {
  return (
    <div className={active ? 'GrudgesListItem is-active' : 'GrudgesListItem'}>
      <h3 className="GrudgesListItem-title">{title}</h3>
      <div className="GrudgesListItem-body">{body}</div>
      <div className="GrudgesListItem-buttons">
        <button onClick={() => store.select(id)}>Select</button>
        <button onClick={() => store.destroy(id)}>Destroy</button>
      </div>
    </div>
  );
};

const ActiveGrudge = ({ grudge }) => {
  if (!grudge) { return <p className="ActiveGrudge">Please select an grudge.</p>; }

  const updateGrudge = (e) => {
    const { name, value } = e.target;
    store.update(grudge.id, Object.assign(grudge, { [name]: value }));
  };

  return (
    <div className="ActiveGrudge">
      <input className="ActiveGrudge-title"
             name="title"
             value={grudge.title}
             onChange={updateGrudge}
      />
      <textarea className="ActiveGrudge-body"
                name="body"
                value={grudge.body}
                onChange={updateGrudge}
      />
    </div>
  );
}

ReactDOM.render(<GrudgeBox title="Grudge Box"/>, document.querySelectory('.application'));
