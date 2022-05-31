from flask import Flask, jsonify, request, session, redirect, flash, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'secure key'
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///patient.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255), nullable=False)
    birthday = db.Column(db.DateTime)
    phone_number = db.Column(db.String(20))
    email = db.Column(db.String(255))
    address = db.Column(db.String(255))
    photo = db.Column(db.Text(), default="default.jpg")
    appointment_time = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, username, password, birthday, phone_number, email, address, photo):
        self.username = username
        self.password = password
        self.birthday = birthday
        self.phone_number = phone_number
        self.email = email
        self.address = address
        self.photo = photo

    def schema(self):
        return {
            'id': self.id,
            'username': self.username,
            'birthday': self.birthday,
            'phone_number': self.phone_number,
            'email': self.email,
            'address': self.address,
            'appointment_time': str(self.appointment_time)
        }


db.create_all()


@app.post('/login')
def login():
    username = request.json["username"]

    patient = Patient.query.filter_by(username=username).first()

    if not patient:
        print("Invalid Username")
        return jsonify({"Error": "Invalid Username"}), 400

    if not patient.password == request.json['password']:
        print("Invalid Password")
        return jsonify({"Error": "Invalid Password"}), 400
    session['login_status'] = True
    session["patient_id"] = patient.id
    return jsonify(patient.schema())


@app.post('/register')
def register():
    username = request.json["username"]
    password = request.json["password"]
    birthday = datetime.strptime(request.json["birthday"], '%Y-%m-%d')
    phone_number = request.json["phoneNumber"]
    email = request.json["email"]
    address = request.json["address"]
    photo = request.json["photoB64"]
    # combine Date and Time
    appointment_time = datetime.strptime(request.json["appointmentDate"] + ' ' + request.json["appointmentTime"],
                                         '%Y-%m-%d %H:%M:%S')
    if len(username) < 1:
        return jsonify({"Error": "Username is empty"}), 400

    if len(password) < 1:
        return jsonify({"Error": "Password is too short"}), 400

    # Find whether username exits
    username_= Patient.query.filter_by(username=username).first()
    if username_:
        print("Duplicate username")
        return jsonify({"Error": "User Already Exists"}), 400

    new_patient = Patient(username, password, birthday, phone_number, email, address, photo)
    new_patient.appointment_time = appointment_time
    db.session.add(new_patient)
    db.session.commit()
    session['login_status'] = True
    session["patient_id"] = new_patient.id

    return jsonify(new_patient.schema())

@app.get('/patients')
def patients():
    pass

@app.post('/logout')
def logout():
    pass


if __name__ == '__main__':
    app.run()
