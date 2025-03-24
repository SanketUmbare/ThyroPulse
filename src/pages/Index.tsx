
import { motion } from "framer-motion";
import { ArrowRight, FileText, History, Activity, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HomePage = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Patient Data Entry",
      description: "Enter patient medical history and symptoms to get accurate predictions.",
      link: "/patient-form",
      linkText: "New Patient",
    },
    {
      icon: <History className="h-8 w-8 text-primary" />,
      title: "Patient History",
      description: "Access previous patient records and their prediction results.",
      link: "/patient-history",
      linkText: "View History",
    },
    {
      icon: <Info className="h-8 w-8 text-primary" />,
      title: "About the Model",
      description: "Learn about the machine learning model and how predictions are made.",
      link: "/about",
      linkText: "Learn More",
    },
  ];

  return (
    <div className="flex flex-col space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block mb-6 p-2 bg-primary/10 rounded-full">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            Thyroid Cancer Prediction Tool
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            An advanced medical application using machine learning to predict thyroid cancer risk
            based on patient data and medical history.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/patient-form">
                Start New Prediction <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover-lift">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-1">{feature.description}</p>
                  <Button asChild variant="ghost" className="mt-auto justify-start pl-0 -ml-3">
                    <Link to={feature.link}>
                      {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
