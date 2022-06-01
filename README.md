# How to compile frontend server
### 1. Enter patient-web
### 2. yarn init
### 3. yarn build
### 4. move build/static to static
### 5. move build/.* (except static) to template

# How to run backend server
### 1. Create virtual environment
```shell
python -m venv venv
```
### 2. Enter venv && Install packages:
```shell
pip install -r requirements.txt
```
### 3. Run the server
```shell
python app.py
```