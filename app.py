from flask import Flask, jsonify, request, session, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'secure key'
CORS(app, supports_credentials=True)

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

    def values(self):
        return [self.id,
                self.username,
                self.birthday,
                self.phone_number,
                self.email,
                self.address,
                str(self.appointment_time)]

    @staticmethod
    def keys():
        return ['id', 'username', 'birthday', 'phone_number', 'email', 'address', 'appointment_time']


db.create_all()
admin = Patient.query.filter_by(id=1, username='admin').first()
if not admin:
    db.session.add(
        Patient(username='admin', password='admin', birthday=None, phone_number='', email='', address='', photo=''))
    db.session.commit()


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


@app.post('/create_user')
def create_user():
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
    username_ = Patient.query.filter_by(username=username).first()
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
    print(session)
    if session.get('login_status'):
        if session["patient_id"] == 1:
            all_patients = [i.values() for i in Patient.query.order_by(Patient.id).all()]
            return jsonify({"headers": Patient.keys(), "patients": all_patients})
        else:
            return jsonify({"headers": Patient.keys(),
                            "patients": [Patient.query.filter_by(id=session["patient_id"]).first().values()]})
    else:
        return jsonify({"Error": "Login First"}), 400


@app.post('/logout')
def logout():
    session['login_status'] = False
    return "Logout"


@app.get('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
