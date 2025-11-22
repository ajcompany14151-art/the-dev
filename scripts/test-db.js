// Simple script to test database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Try to count projects
    const count = await prisma.project.count();
    console.log(`✅ Database connected! Found ${count} projects.`);
    
    // Test creating a project
    const testProject = await prisma.project.create({
      data: {
        userId: 'anonymous',
        name: 'test-project',
        messages: {
          create: {
            content: 'Test message',
            role: 'USER',
            type: 'RESULT',
          }
        }
      }
    });
    console.log(`✅ Created test project: ${testProject.id}`);
    
    // Clean up
    await prisma.project.delete({
      where: { id: testProject.id }
    });
    console.log('✅ Cleaned up test project');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
