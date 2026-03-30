
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, ClipboardList, BarChart3, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';

const HomePage = () => {
  const features = [
    {
      icon: ClipboardList,
      title: 'Daily work logging',
      description: 'Employees can easily submit daily task logs with hours spent, status updates, and detailed work descriptions'
    },
    {
      icon: BarChart3,
      title: 'Performance analytics',
      description: 'Managers get comprehensive insights with task completion rates, team activity charts, and top performer tracking'
    },
    {
      icon: Users,
      title: 'Team directory',
      description: 'Access a complete directory of all employees, view individual profiles, and track historical performance data'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Future Designz - Employee Performance Portal</title>
        <meta name="description" content="Streamline employee performance tracking with daily work logs, analytics, and team management tools" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/20 z-0"></div>
          
          <div className="absolute inset-0 opacity-15 z-0">
            <img
              src="https://images.unsplash.com/photo-1570126618953-d437176e8c79"
              alt="Modern office collaboration"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <img 
                src="https://horizons-cdn.hostinger.com/945a9ac3-86d1-4391-91a3-db16b6b4c9d0/a85c19b66da0797edd274fe698bfc0b0.png" 
                alt="Future Designz Logo" 
                className="h-24 md:h-32 w-auto object-contain mb-8 drop-shadow-xl"
              />
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Performance Portal
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Empower your team with streamlined performance tracking, real-time analytics, and comprehensive work logging.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8 py-6 transition-all duration-200 active:scale-[0.98] shadow-lg">
                    Employee Login
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 transition-all duration-200 active:scale-[0.98] bg-background/50 backdrop-blur-sm">
                    Manager Access
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-muted/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything you need to track performance
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for modern teams who value transparency and data-driven insights
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b"
              alt="Data analytics dashboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to improve team productivity?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join Future Designz teams who trust our platform to track performance and drive results.
              </p>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 transition-all duration-200 active:scale-[0.98] shadow-xl">
                  Login to your account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <footer className="bg-card border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <img 
                  src="https://horizons-cdn.hostinger.com/945a9ac3-86d1-4391-91a3-db16b6b4c9d0/a85c19b66da0797edd274fe698bfc0b0.png" 
                  alt="Future Designz Logo" 
                  className="h-6 w-auto grayscale opacity-50"
                />
                <p className="text-sm text-muted-foreground">
                  © 2026 Future Designz. All rights reserved.
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
