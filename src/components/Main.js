import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Student</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.studentName.value
          const school = this.studentSchool.value
          const score = this.studentScore.value.toString()
          const price = window.web3.utils.toWei(this.studentPrice.value.toString(), 'Ether')
          this.props.createStudent(name, school, score, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="studentName"
              type="text"
              ref={(input) => { this.studentName = input }}
              className="form-control"
              placeholder="Student Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="studentSchool"
              type="text"
              ref={(input) => { this.studentSchool = input }}
              className="form-control"
              placeholder="Student School"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="studentScore"
              type="number"
              ref={(input) => { this.studentScore = input }}
              className="form-control"
              placeholder="Student Score"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="studentPrice"
              type="number"
              ref={(input) => { this.studentPrice = input }}
              className="form-control"
              placeholder="Student Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Student</button>
        </form>
        <p>&nbsp;</p>
        <h2>Enroll Student</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">School</th>
              <th scope="col">Score Test</th>
              <th scope="col">Value</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="studentList">
            { this.props.students.map((student, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{student.id.toString()}</th>
                  <td>{student.name}</td>
                  <td>{student.school}</td>
                  <td>{student.testScore.toString()}</td>
                  <td>{window.web3.utils.fromWei(student.price.toString(), 'Ether')} Eth</td>
                  <td>{student.owner}</td>
                  <td>
                    { !student.purchased
                      ? <button
                          name={student.id}
                          value={student.price}
                          onClick={(event) => {
                            this.props.purchaseStudent(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
