
# ThyroPulse

ThyroPulse is a thyroid disease prediction web application that leverages machine learning to provide early risk assessments based on user-inputted health data. The app offers an intuitive interface and real-time predictions to assist users in monitoring their thyroid health.

## 🔍 Features

- 🧠 **Machine Learning Model** – Trained on real thyroid disease datasets using Scikit-learn.
- 🖥️ **Streamlit Interface** – User-friendly, interactive UI for seamless data input and predictions.
- 📊 **Data Preprocessing** – Efficient handling of missing values, encoding, and scaling.
- 📈 **Prediction Output** – Displays whether the input indicates thyroid disease or not.

## 🛠️ Tech Stack

- Python
- Scikit-learn
- Pandas, NumPy
- Streamlit

## 🚀 Getting Started

### Prerequisites

Ensure Python 3.7+ is installed. Install the required packages:

```bash
pip install -r requirements.txt
```

### Running the App

```bash
streamlit run app.py
```

The app will open in your default browser. You can input health metrics and receive a prediction instantly.

## 📂 Project Structure

```
ThyroPulse/
│
├── app.py                 # Main Streamlit app
├── thyroid_model.pkl      # Pre-trained ML model
├── model_training.ipynb   # Notebook for model training
├── data/                  # Dataset used for training
├── requirements.txt       # Dependencies
```

## 📉 Dataset

The dataset used for training was sourced from a publicly available thyroid disease dataset. It includes medical attributes such as TSH, T3, TT4, FTI, and patient demographics.

## 🧪 Model Info

- **Model Type:** Logistic Regression (can be extended to other models)
- **Accuracy:** ~95% (subject to change based on final version and test conditions)

## 📌 Future Improvements

- Integration with cloud-based storage for user data.
- More advanced models (XGBoost, RandomForest, etc.)
- Improved UI/UX with visual insights.
- Mobile-responsive version.

## 🤝 Contributions

Contributions, suggestions, and improvements are welcome! Feel free to fork this repository and submit a pull request.
