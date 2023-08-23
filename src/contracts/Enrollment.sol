pragma solidity ^0.5.0;

contract Enrollment {
    string public name;
    uint public studentCount = 0;
    mapping(uint => Student) public students;

    struct Student {
        uint id;
        string name;
        string school;
        uint testScore;
        uint price;
        address payable owner;
        bool purchased;
    }

    event StudentCreated(
        uint id,
        string name,
        string school,
        uint testScore,
        uint price,
        address payable owner,
        bool purchased
    );

    event StudentPurchased(
        uint id,
        string name,
        string school,
        uint testScore,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Darmajaya Student Enrollment";
    }

    function createStudent(string memory _name, string memory _school, uint _testScore, uint _price) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid school
        require(bytes(_school).length > 0);
        // Require a valid test score
        require(_testScore > 0);
        // Require a valid price
        require(_price > 0);
        // Increment student count
        studentCount ++;
        // Create the student
        students[studentCount] = Student(studentCount, _name, _school, _testScore, _price, msg.sender, false);
        // Trigger an event
        emit StudentCreated(studentCount, _name, _school, _testScore, _price, msg.sender, false);
    }

    function purchaseStudent(uint _id) public payable {
        // Fetch the student
        Student memory _student = students[_id];
        // Fetch the owner
        address payable _seller = _student.owner;
        // Make sure the student has a valid id
        require(_student.id > 0 && _student.id <= studentCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _student.price);
        // Require that the student has not been purchased already
        require(!_student.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        _student.owner = msg.sender;
        // Mark as purchased
        _student.purchased = true;
        // Update the student
        students[_id] = _student;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit StudentPurchased(studentCount, _student.name, _student.school, _student.testScore, _student.price, msg.sender, true);
    }
}
