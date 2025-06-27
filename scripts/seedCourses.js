// scripts/seedCourses.js
const mongoose = require('mongoose');
const Course = require('../models/Course');
const dotenv = require('dotenv');

dotenv.config();

const sampleCourses = [
  {
    title: "Complete React.js Bootcamp",
    description: "Pelajari React.js dari dasar hingga mahir. Course ini mencakup semua yang perlu Anda ketahui untuk menjadi React developer profesional. Mulai dari JSX, Components, State Management, hingga deployment aplikasi React ke production.",
    shortDescription: "Belajar React.js dari nol hingga mahir dengan project nyata",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    price: 299000,
    originalPrice: 499000,
    duration: "8 minggu",
    level: "Beginner",
    category: "Web Development",
    instructor: {
      name: "Budi Santoso",
      bio: "Senior Frontend Developer dengan 5+ tahun pengalaman di startup unicorn",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      experience: "5+ tahun sebagai Frontend Developer"
    },
    curriculum: [
      {
        title: "Pengenalan React.js",
        duration: "2 jam",
        description: "Memahami konsep dasar React, JSX, dan Virtual DOM"
      },
      {
        title: "Components dan Props",
        duration: "3 jam", 
        description: "Membuat dan menggunakan React components dengan props"
      },
      {
        title: "State dan Event Handling",
        duration: "3 jam",
        description: "Mengelola state dan menangani user interactions"
      },
      {
        title: "React Hooks",
        duration: "4 jam",
        description: "useState, useEffect, dan custom hooks"
      },
      {
        title: "Project: Todo App",
        duration: "5 jam",
        description: "Membangun aplikasi Todo lengkap dengan React"
      }
    ],
    whatYouWillLearn: [
      "Memahami konsep dasar React.js dan JSX",
      "Membuat komponen React yang reusable",
      "Mengelola state dengan React Hooks",
      "Menangani user interactions dan events",
      "Membangun aplikasi React yang kompleks",
      "Deploy aplikasi React ke production"
    ],
    requirements: [
      "Pemahaman dasar HTML, CSS, dan JavaScript",
      "Familiar dengan ES6+ syntax",
      "Komputer dengan Node.js terinstall",
      "Text editor (VS Code recommended)"
    ],
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    totalStudents: 1250,
    rating: 4.8,
    totalReviews: 324
  },
  {
    title: "Node.js & Express.js Backend Development",
    description: "Kuasai backend development dengan Node.js dan Express.js. Pelajari cara membangun REST API, authentication, database integration, dan deploy ke cloud. Course ini cocok untuk yang ingin menjadi fullstack developer.",
    shortDescription: "Belajar backend development dengan Node.js dan Express.js",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
    price: 349000,
    originalPrice: 599000,
    duration: "10 minggu",
    level: "Intermediate",
    category: "Web Development",
    instructor: {
      name: "Sari Dewi",
      bio: "Backend Engineer di perusahaan fintech dengan expertise Node.js",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      experience: "6+ tahun sebagai Backend Engineer"
    },
    curriculum: [
      {
        title: "Node.js Fundamentals",
        duration: "3 jam",
        description: "Memahami Node.js runtime dan module system"
      },
      {
        title: "Express.js Framework",
        duration: "4 jam",
        description: "Membangun web server dengan Express.js"
      },
      {
        title: "Database Integration",
        duration: "5 jam",
        description: "Koneksi ke MongoDB dan PostgreSQL"
      },
      {
        title: "Authentication & Authorization",
        duration: "4 jam",
        description: "JWT, bcrypt, dan security best practices"
      },
      {
        title: "Project: E-commerce API",
        duration: "8 jam",
        description: "Membangun REST API untuk aplikasi e-commerce"
      }
    ],
    whatYouWillLearn: [
      "Membangun REST API dengan Node.js dan Express.js",
      "Integrasi database MongoDB dan PostgreSQL",
      "Implementasi authentication dan authorization",
      "Error handling dan validation",
      "Testing API dengan Jest",
      "Deploy ke cloud (AWS, Heroku)"
    ],
    requirements: [
      "Pemahaman JavaScript yang solid",
      "Familiar dengan konsep HTTP dan REST API",
      "Basic understanding of databases",
      "Komputer dengan Node.js terinstall"
    ],
    tags: ["Node.js", "Express.js", "Backend", "API", "MongoDB"],
    totalStudents: 890,
    rating: 4.7,
    totalReviews: 267
  },
  {
    title: "UI/UX Design Masterclass",
    description: "Pelajari prinsip-prinsip design yang baik dan cara membuat user experience yang luar biasa. Course ini mencakup design thinking, wireframing, prototyping, dan tools seperti Figma. Cocok untuk pemula yang ingin berkarir di bidang design.",
    shortDescription: "Belajar UI/UX Design dari nol dengan tools modern",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    price: 199000,
    originalPrice: 399000,
    duration: "6 minggu",
    level: "Beginner",
    category: "UI/UX Design",
    instructor: {
      name: "Andi Pratama",
      bio: "Senior UI/UX Designer di startup teknologi terkemuka",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      experience: "4+ tahun sebagai UI/UX Designer"
    },
    curriculum: [
      {
        title: "Design Thinking Process",
        duration: "2 jam",
        description: "Memahami proses design thinking dan user-centered design"
      },
      {
        title: "User Research & Personas",
        duration: "3 jam",
        description: "Melakukan riset user dan membuat user personas"
      },
      {
        title: "Wireframing & Prototyping",
        duration: "4 jam",
        description: "Membuat wireframe dan prototype dengan Figma"
      },
      {
        title: "Visual Design Principles",
        duration: "3 jam",
        description: "Typography, color theory, dan layout principles"
      },
      {
        title: "Project: Mobile App Design",
        duration: "6 jam",
        description: "Mendesain aplikasi mobile dari konsep hingga prototype"
      }
    ],
    whatYouWillLearn: [
      "Memahami proses design thinking",
      "Melakukan user research yang efektif",
      "Membuat wireframe dan prototype",
      "Menguasai Figma untuk UI design",
      "Memahami prinsip visual design",
      "Membuat design system yang konsisten"
    ],
    requirements: [
      "Tidak ada requirement khusus",
      "Komputer dengan akses internet",
      "Akun Figma (gratis)",
      "Kreativitas dan kemauan belajar"
    ],
    tags: ["UI/UX", "Design", "Figma", "Prototyping", "User Research"],
    totalStudents: 2100,
    rating: 4.9,
    totalReviews: 456
  }
];

const seedCourses = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert sample courses
    const courses = await Course.insertMany(sampleCourses);
    console.log(`✅ Inserted ${courses.length} sample courses`);

    // Display course info
    courses.forEach(course => {
      console.log(`📚 ${course.title} - ${course.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`);
    });

    console.log('🎉 Seed completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

// Run seed
seedCourses();