import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import Enrollment from '../abis/Enrollment.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Enrollment.networks[networkId]

    if(networkData) {
      const enrollment = web3.eth.Contract(Enrollment.abi, networkData.address)
      this.setState({ enrollment })
      const studentCount = await enrollment.methods.studentCount().call()
      this.setState({ studentCount })
      // Load students
      for (var i = 1; i <= studentCount; i++) {
        const student = await enrollment.methods.students(i).call()
        this.setState({
          students: [...this.state.students, student]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Enrollment contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      studentCount: 0,
      students: [],
      loading: true
    }

    this.createStudent = this.createStudent.bind(this)
    this.purchaseStudent = this.purchaseStudent.bind(this)
  }

  createStudent(name, school, score, price) {
    this.setState({ loading: true })
    this.state.enrollment.methods.createStudent(name, school, score, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseStudent(id, price) {
    this.setState({ loading: true })
    this.state.enrollment.methods.purchaseStudent(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  students={this.state.students}
                  createStudent={this.createStudent}
                  purchaseStudent={this.purchaseStudent} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
