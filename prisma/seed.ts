const { PrismaClient } = require('@prisma/client')
const { randomBytes } = require('crypto')

const prisma = new PrismaClient()

const generateRandomImage = () => {
  return randomBytes(20)
}

async function main() {
  const products = [
    {
      name: 'Professional Suite',
      description: 'A comprehensive software suite for professionals.',
      features: JSON.stringify([
        { name: 'Document Processing', description: 'Advanced document editing and management.' },
        { name: 'Data Analysis', description: 'Powerful tools for data visualization and analysis.' },
        { name: 'Cloud Integration', description: 'Seamless integration with major cloud services.' }
      ]),
      image: generateRandomImage(),
      durations: JSON.stringify([3, 6, 12, 24])
    },
    {
      name: 'Security Shield',
      description: 'Comprehensive security solution for businesses.',
      features: JSON.stringify([
        { name: 'Firewall', description: 'Advanced firewall protection.' },
        { name: 'Antivirus', description: 'Real-time virus and malware protection.' },
        { name: 'Data Encryption', description: 'End-to-end encryption for sensitive data.' }
      ]),
      image: generateRandomImage(),
      durations: JSON.stringify([6, 12, 24, 36])
    },
    {
      name: 'Creative Studio',
      description: 'Suite of tools for digital content creation.',
      features: JSON.stringify([
        { name: 'Image Editing', description: 'Professional-grade image editing tools.' },
        { name: 'Video Production', description: 'Comprehensive video editing and effects.' },
        { name: 'Audio Mastering', description: 'Advanced audio processing and mastering tools.' }
      ]),
      image: generateRandomImage(),
      durations: JSON.stringify([1, 3, 12, 24])
    },
    {
      name: 'Project Manager Pro',
      description: 'Efficient project management solution for teams.',
      features: JSON.stringify([
        { name: 'Task Tracking', description: 'Detailed task management and tracking.' },
        { name: 'Team Collaboration', description: 'Tools for seamless team communication.' },
        { name: 'Resource Allocation', description: 'Optimize resource allocation across projects.' }
      ]),
      image: generateRandomImage(),
      durations: JSON.stringify([3, 6, 12])
    },
    {
      name: 'Data Insights',
      description: 'Advanced data analytics and visualization platform.',
      features: JSON.stringify([
        { name: 'Big Data Processing', description: 'Handle and process large datasets efficiently.' },
        { name: 'AI-Powered Analytics', description: 'Leverage AI for deeper data insights.' },
        { name: 'Custom Reporting', description: 'Create tailored reports and dashboards.' }
      ]),
      image: generateRandomImage(),
      durations: JSON.stringify([1, 6, 12, 36])
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Seed data for products has been added successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })