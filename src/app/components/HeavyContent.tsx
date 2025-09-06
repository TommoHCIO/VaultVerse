import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, Users, Trophy, Star } from 'lucide-react';

export default function HeavyContent() {
  const features = [
    {
      icon: Shield,
      title: 'Shield Protection',
      description: 'Advanced loss protection with our revolutionary Shield utility system.',
      color: 'neon-green'
    },
    {
      icon: Zap,
      title: 'Live Events',
      description: '15-minute high-energy prediction battles with real-time results.',
      color: 'neon-cyan'
    },
    {
      icon: Trophy,
      title: 'Rewards System',
      description: 'Earn exclusive rewards and climb the global leaderboards.',
      color: 'neon-purple'
    }
  ];

  return (
    <>
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next evolution of prediction markets with cutting-edge features designed for the future.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card-lg rounded-2xl p-8 text-center hover-neon group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={`w-16 h-16 mx-auto mb-6 gradient-${feature.color} rounded-2xl flex items-center justify-center group-hover:animate-pulse`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-${feature.color}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center glass-card-lg rounded-3xl p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to
            <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent"> Enter </span>
            the Arena?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders in the world's most advanced prediction market platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-neon-large">
              Start Trading Now
            </button>
            <button className="btn-secondary-large">
              Learn More
            </button>
          </div>
        </motion.div>
      </section>
    </>
  );
}