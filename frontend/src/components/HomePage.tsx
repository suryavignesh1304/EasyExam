'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, FileText, Zap, Book, Edit3, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const [isHovering, setIsHovering] = useState('')
    const navigate = useNavigate()

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const staggerChildren = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const handleNavigation = (path: string) => {
        navigate(path)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-800">
            <header className="container mx-auto px-4 py-8">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold text-center text-blue-600"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    PDF to CBT Converter
                </motion.h1>
            </header>

            <main className="container mx-auto px-4">
                {/* Hero Section */}
                <motion.section
                    className="text-center py-12 md:py-24"
                    initial="initial"
                    animate="animate"
                    variants={staggerChildren}
                >
                    <motion.p className="text-xl md:text-2xl mb-8" variants={fadeIn}>
                        Convert your PDF files into an interactive Computer Based Test format with ease!
                    </motion.p>
                    <motion.button
                        onClick={() => handleNavigation('/upload')}
                        className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Upload PDF
                    </motion.button>
                </motion.section>

                {/* Features Section */}
                <motion.section
                    className="py-12 md:py-24"
                    initial="initial"
                    animate="animate"
                    variants={staggerChildren}
                >
                    <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" variants={fadeIn}>
                        Key Features
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Upload size={40} />, title: 'Fast Conversion', description: 'Convert your PDFs in seconds', path: '/upload' },
                            { icon: <FileText size={40} />, title: 'Automatic Extraction', description: 'AI-powered question recognition', path: '/upload' },
                            { icon: <Zap size={40} />, title: 'Customizable Formats', description: 'Tailor the CBT to your needs', path: '/upload' },
                            { icon: <Book size={40} />, title: 'Predefined Exams', description: 'Start with ready-made tests', path: '/predefined-exams' },
                            { icon: <Edit3 size={40} />, title: 'Text to PDF', description: 'Create PDFs from text input', path: '/text-to-pdf' },
                            { icon: <HelpCircle size={40} />, title: 'PDF Instructions', description: 'Learn about PDF structure', path: '/pdf-instructions' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-lg text-center cursor-pointer"
                                variants={fadeIn}
                                whileHover={{ scale: 1.05 }}
                                onHoverStart={() => setIsHovering(`feature-${index}`)}
                                onHoverEnd={() => setIsHovering('')}
                                onClick={() => handleNavigation(feature.path)}
                            >
                                <motion.div
                                    className="text-blue-600 mb-4 inline-block"
                                    animate={{
                                        rotate: isHovering === `feature-${index}` ? 360 : 0,
                                        scale: isHovering === `feature-${index}` ? 1.2 : 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Call to Action Section */}
                <motion.section
                    className="text-center py-12 md:py-24"
                    initial="initial"
                    animate="animate"
                    variants={staggerChildren}
                >
                    <motion.h2 className="text-3xl md:text-4xl font-bold mb-8" variants={fadeIn}>
                        Ready to Transform Your PDFs?
                    </motion.h2>
                    <motion.button
                        onClick={() => handleNavigation('/upload')}
                        className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Converting Now
                    </motion.button>
                </motion.section>
            </main>

            <footer className="bg-gray-100 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>&copy; 2024 Surya Vignesh Kapuganti. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}