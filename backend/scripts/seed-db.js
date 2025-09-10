// scripts/seed-db.js
import { db } from '../database.js';
import { colleges, users, courses, enrollments } from '../schema.js';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (be careful in production!)
    console.log('🗑️  Clearing existing data...');
    await db.delete(enrollments);
    await db.delete(courses);
    await db.delete(users);
    await db.delete(colleges);

    // Seed colleges
    console.log('🏫 Seeding colleges...');
    const collegeData = await db.insert(colleges).values([
      {
        name: 'Massachusetts Institute of Technology',
        code: 'MIT',
        address: 'Cambridge, MA, USA'
      },
      {
        name: 'Stanford University',
        code: 'STANFORD',
        address: 'Stanford, CA, USA'
      },
      {
        name: 'Indian Institute of Technology Delhi',
        code: 'IITD',
        address: 'New Delhi, India'
      },
      {
        name: 'University of California Berkeley',
        code: 'UCB',
        address: 'Berkeley, CA, USA'
      }
    ]).returning();

    console.log(`✅ Created ${collegeData.length} colleges`);

    // Seed users (teachers and students)
    console.log('👥 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const userData = await db.insert(users).values([
      // Teachers
      {
        name: 'Dr. John Smith',
        email: 'john.smith@mit.edu',
        password: hashedPassword,
        role: 'teacher',
        collegeId: collegeData[0].id,
        department: 'Computer Science',
        employeeId: 'MIT001'
      },
      {
        name: 'Prof. Sarah Johnson',
        email: 'sarah.johnson@stanford.edu',
        password: hashedPassword,
        role: 'teacher',
        collegeId: collegeData[1].id,
        department: 'Mathematics',
        employeeId: 'STAN001'
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@iitd.ac.in',
        password: hashedPassword,
        role: 'teacher',
        collegeId: collegeData[2].id,
        department: 'Computer Science',
        employeeId: 'IITD001'
      },

      // Students
      {
        name: 'Alice Williams',
        email: 'alice.williams@student.mit.edu',
        password: hashedPassword,
        role: 'student',
        collegeId: collegeData[0].id,
        degree: 'Computer Science',
        year: 2,
        rollNumber: 'MIT2022001'
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@student.mit.edu',
        password: hashedPassword,
        role: 'student',
        collegeId: collegeData[0].id,
        degree: 'Computer Science',
        year: 2,
        rollNumber: 'MIT2022002'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie.brown@student.stanford.edu',
        password: hashedPassword,
        role: 'student',
        collegeId: collegeData[1].id,
        degree: 'Mathematics',
        year: 3,
        rollNumber: 'STAN2021001'
      },
      {
        name: 'Diana Prince',
        email: 'diana.prince@student.stanford.edu',
        password: hashedPassword,
        role: 'student',
        collegeId: collegeData[1].id,
        degree: 'Mathematics',
        year: 3,
        rollNumber: 'STAN2021002'
      },
      {
        name: 'Arjun Sharma',
        email: 'arjun.sharma@iitd.ac.in',
        password: hashedPassword,
        role: 'student',
        collegeId: collegeData[2].id,
        degree: 'Computer Science',
        year: 1,
        rollNumber: 'IITD2023001'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@iitd.ac.in',
        password: hashedPassword,
        role: 'student',
        collegeId: collegeData[2].id,
        degree: 'Computer Science',
        year: 1,
        rollNumber: 'IITD2023002'
      }
    ]).returning();

    console.log(`✅ Created ${userData.length} users`);

    // Find teachers for course creation
    const teachers = userData.filter(user => user.role === 'teacher');
    const students = userData.filter(user => user.role === 'student');

    // Seed courses
    console.log('📚 Seeding courses...');
    const courseData = await db.insert(courses).values([
      // MIT Courses
      {
        name: 'Introduction to Computer Science',
        code: 'CS101',
        collegeId: collegeData[0].id,
        teacherId: teachers[0].id,
        department: 'Computer Science',
        semester: 1,
        year: 2024,
        credits: 3
      },
      {
        name: 'Data Structures and Algorithms',
        code: 'CS201',
        collegeId: collegeData[0].id,
        teacherId: teachers[0].id,
        department: 'Computer Science',
        semester: 2,
        year: 2024,
        credits: 4
      },

      // Stanford Courses
      {
        name: 'Calculus I',
        code: 'MATH101',
        collegeId: collegeData[1].id,
        teacherId: teachers[1].id,
        department: 'Mathematics',
        semester: 1,
        year: 2024,
        credits: 3
      },
      {
        name: 'Linear Algebra',
        code: 'MATH201',
        collegeId: collegeData[1].id,
        teacherId: teachers[1].id,
        department: 'Mathematics',
        semester: 2,
        year: 2024,
        credits: 3
      },

      // IIT Delhi Courses
      {
        name: 'Programming Fundamentals',
        code: 'CSE101',
        collegeId: collegeData[2].id,
        teacherId: teachers[2].id,
        department: 'Computer Science',
        semester: 1,
        year: 2024,
        credits: 3
      },
      {
        name: 'Object Oriented Programming',
        code: 'CSE102',
        collegeId: collegeData[2].id,
        teacherId: teachers[2].id,
        department: 'Computer Science',
        semester: 2,
        year: 2024,
        credits: 4
      }
    ]).returning();

    console.log(`✅ Created ${courseData.length} courses`);

    // Seed enrollments
    console.log('📝 Seeding enrollments...');
    
    // MIT students enrolled in MIT courses
    const mitStudents = students.filter(s => s.collegeId === collegeData[0].id);
    const mitCourses = courseData.filter(c => c.collegeId === collegeData[0].id);
    
    // Stanford students enrolled in Stanford courses
    const stanfordStudents = students.filter(s => s.collegeId === collegeData[1].id);
    const stanfordCourses = courseData.filter(c => c.collegeId === collegeData[1].id);
    
    // IIT Delhi students enrolled in IIT Delhi courses
    const iitdStudents = students.filter(s => s.collegeId === collegeData[2].id);
    const iitdCourses = courseData.filter(c => c.collegeId === collegeData[2].id);

    const enrollmentData = [];

    // Enroll MIT students
    mitStudents.forEach(student => {
      mitCourses.forEach(course => {
        enrollmentData.push({
          studentId: student.id,
          courseId: course.id
        });
      });
    });

    // Enroll Stanford students
    stanfordStudents.forEach(student => {
      stanfordCourses.forEach(course => {
        enrollmentData.push({
          studentId: student.id,
          courseId: course.id
        });
      });
    });

    // Enroll IIT Delhi students
    iitdStudents.forEach(student => {
      iitdCourses.forEach(course => {
        enrollmentData.push({
          studentId: student.id,
          courseId: course.id
        });
      });
    });

    await db.insert(enrollments).values(enrollmentData);

    console.log(`✅ Created ${enrollmentData.length} enrollments`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts Created:');
    console.log('\n👨‍🏫 Teachers:');
    console.log('Email: john.smith@mit.edu | Password: password123');
    console.log('Email: sarah.johnson@stanford.edu | Password: password123');
    console.log('Email: rajesh.kumar@iitd.ac.in | Password: password123');
    
    console.log('\n👨‍🎓 Students:');
    console.log('Email: alice.williams@student.mit.edu | Password: password123');
    console.log('Email: bob.johnson@student.mit.edu | Password: password123');
    console.log('Email: charlie.brown@student.stanford.edu | Password: password123');
    console.log('Email: diana.prince@student.stanford.edu | Password: password123');
    console.log('Email: arjun.sharma@iitd.ac.in | Password: password123');
    console.log('Email: priya.patel@iitd.ac.in | Password: password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };