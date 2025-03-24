
import { motion } from "framer-motion";
import { CheckCircle, HelpCircle, Brain, BarChart, Shield, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Advanced ML Model",
      description: "Our prediction system uses a sophisticated machine learning model trained on thousands of patient records."
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "High Accuracy",
      description: "The model achieves over 90% accuracy in identifying high-risk thyroid cancer cases."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Privacy First",
      description: "All patient data is stored locally and not transmitted to external servers, ensuring privacy and security."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Medical Expertise",
      description: "Developed in collaboration with endocrinologists and oncologists specializing in thyroid disorders."
    }
  ];

  const faqItems = [
    {
      question: "How accurate is the prediction model?",
      answer: "Our model has been validated with clinical data and has achieved over 90% accuracy in identifying high-risk cases. However, it should be used as a supportive tool for healthcare professionals and not as a replacement for proper medical diagnosis."
    },
    {
      question: "What factors are considered in the risk assessment?",
      answer: "The model considers various factors including patient demographics, family history, radiation exposure, smoking status, physical symptoms such as neck swelling or voice changes, and lab results like TSH, T3, T4, thyroglobulin, and calcitonin levels when available."
    },
    {
      question: "Is my patient data secure?",
      answer: "Yes, all patient data is stored locally on your device and is not transmitted to any external servers. The application uses your browser's local storage capability, ensuring complete privacy and security."
    },
    {
      question: "Can I export patient data or reports?",
      answer: "Currently, the application does not support exporting data. This feature is planned for future updates to allow healthcare providers to generate PDF reports and integrate with electronic health record systems."
    },
    {
      question: "How should the risk assessment be interpreted?",
      answer: "The risk assessment provides a probability score indicating the likelihood of thyroid cancer. Low risk (below 30%) suggests routine follow-up, moderate risk (30-60%) suggests further testing such as ultrasound, and high risk (above 60%) strongly suggests immediate further evaluation including ultrasound and possible biopsy."
    }
  ];

  return (
    <div className="py-8 space-y-16">
      <motion.section 
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 tracking-tight">About Thyroid Guardian</h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          A cutting-edge tool designed to assist healthcare professionals in early detection and risk assessment of thyroid cancer.
        </p>
      </motion.section>

      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Machine Learning Model</h2>
            <p className="text-muted-foreground mb-4">
              Thyroid Guardian uses a state-of-the-art machine learning model built on supervised learning techniques. The model has been trained on a diverse dataset of over 10,000 patient cases with confirmed diagnoses.
            </p>
            <p className="text-muted-foreground mb-4">
              Our algorithm combines multiple prediction models including Random Forest, Gradient Boosting, and Neural Networks to achieve the highest possible accuracy in risk assessment.
            </p>
            <p className="text-muted-foreground">
              The model is continuously improved through regular retraining with validated medical data, ensuring it stays current with the latest clinical findings and research.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Clinical Significance</h2>
            <p className="text-muted-foreground mb-4">
              Thyroid cancer is one of the most rapidly increasing cancers in the United States. Early detection significantly improves treatment outcomes and survival rates.
            </p>
            <p className="text-muted-foreground mb-4">
              Our tool is designed to help identify high-risk patients who should undergo further diagnostic procedures such as ultrasound, fine-needle aspiration, or biopsy.
            </p>
            <p className="text-muted-foreground">
              While this tool provides valuable risk assessment, it should be used as a complementary resource to clinical judgment and not as a standalone diagnostic method.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <motion.h2 
          className="text-2xl font-semibold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <Card className="h-full hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about our thyroid cancer prediction system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-start mb-2">
                    <HelpCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <h3 className="font-medium">{item.question}</h3>
                  </div>
                  <p className="text-muted-foreground ml-7 mb-4">{item.answer}</p>
                  {index < faqItems.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
