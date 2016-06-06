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

    return (
      <div className="GrudgeBox">
        <header>
          <h1>{this.props.person}</h1>
          <GrudgesCount />
          <CreateGrudge/>
          <GrudgesList grudges={this.state.grudges}/>
        </header>
      </div>
    );
  }
}

class CreateGrudge extends React.Component {
  constructor() {
    super();
    this.state = {
      person: '',
      grudge: '',
    };
  }

  updateProperties(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  createGrudge(e) {
    e.preventDefault();
    store.create(this.state);
    this.setState({ person: '', grudge: '' });
  }

  render() {
    return (
      <div className="CreateGrudge">
        <input className="CreateGrudge-person"
               name="person"
               placeholder="Person"
               value={this.state.person}
               onChange={(e) => this.updateProperties(e)}
        />
        <textarea className="CreateGrudge-grudge"
                  name="grudge"
                  placeholder="Grudge"
                  value={this.state.grudge}
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

const GrudgesListItem = ({ id, person, grudge, forgiven, active }) => {
  let forgiveButton = isForgiven(forgiven, id);

  return (
    <div className={active ? 'GrudgesListItem is-active' : 'GrudgesListItem'}>
      <h3 className="GrudgesListItem-person">{person}</h3>
      <div className="GrudgesListItem-grudge">{grudge}</div>
      <div className="GrudgesListItem-buttons">
        <strong>{forgiveButton}</strong>
      </div>
    </div>
  );
};

function isForgiven(forgiven, id) {
  if (forgiven === true) {
    return "Forgiven"
  } else {
    return <button onClick={() => bin.forgive(id)}>Forgive</button>
  }
}

const GrudgesCount = () => {
  let totalCount = store.all().length;
  let forgivenCount = store.forgiven();
  var unforgivenCount = store.unforgiven();

  return (
    <section>
      <p>Total Grudges: {totalCount}</p>
      <p>Forgiven Grudges: {forgivenCount}</p>
      <p>Unforgiven Grudges: {unforgivenCount}</p>
    </section>
  );
}

ReactDOM.render(<GrudgeBox person="Grudge Box"/>, document.querySelector('.application'));
