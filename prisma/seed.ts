import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // First clear existing products
  console.log('Cleaning existing data...');
  await prisma.license.deleteMany({});
  await prisma.licenseRequest.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Starting to seed products...');

  const products = [
    {
      name: 'Canva Pro',
      description: 'Professional graphic design platform with premium features.',
      features: JSON.stringify([
        { name: 'Premium Templates', description: 'Access to millions of premium templates' },
        { name: 'Brand Kit', description: 'Save your brand colors and fonts' },
        { name: 'Background Remover', description: 'Remove backgrounds with one click' },
        { name: 'Custom Fonts', description: 'Upload and use your own fonts' }
      ]),
      durations: JSON.stringify([3, 6, 12, 24]),
      versions: JSON.stringify(['1.0.0', '2.0.0', '2.1.0'])
    },
    {
      name: 'Microsoft 365',
      description: 'Complete suite of productivity tools for business.',
      features: JSON.stringify([
        { name: 'Office Apps', description: 'Word, Excel, PowerPoint, and more' },
        { name: 'Cloud Storage', description: '1TB OneDrive storage' },
        { name: 'Teams', description: 'Video conferencing and collaboration' },
        { name: 'Exchange', description: 'Business email hosting' }
      ]),
      durations: JSON.stringify([12, 24, 36]),
      versions: JSON.stringify(['2021', '2024'])
    },
    {
      name: 'Adobe Creative Cloud',
      description: 'Professional creative tools for designers and artists.',
      features: JSON.stringify([
        { name: 'Photoshop', description: 'Professional photo editing' },
        { name: 'Illustrator', description: 'Vector graphics editor' },
        { name: 'Premiere Pro', description: 'Video editing software' },
        { name: 'After Effects', description: 'Motion graphics and effects' }
      ]),
      durations: JSON.stringify([1, 12, 24]),
      versions: JSON.stringify(['2023', '2024'])
    },
    {
      name: 'Slack Enterprise',
      description: 'Enterprise-grade team communication platform.',
      features: JSON.stringify([
        { name: 'Unlimited History', description: 'Access to all message history' },
        { name: 'Enterprise Security', description: 'Advanced security features' },
        { name: 'Custom Workflows', description: 'Create automated workflows' },
        { name: 'Analytics', description: 'Advanced analytics and reporting' }
      ]),
      durations: JSON.stringify([6, 12, 24]),
      versions: JSON.stringify(['1.0.0', '2.0.0'])
    },
    {
      name: 'OpenAI API',
      description: 'Access to state-of-the-art AI models and APIs.',
      features: JSON.stringify([
        { name: 'GPT-4 Access', description: 'Latest language model access' },
        { name: 'DALL-E Integration', description: 'Image generation capabilities' },
        { name: 'Fine-tuning', description: 'Custom model training options' },
        { name: 'API Support', description: '24/7 technical support' }
      ]),
      durations: JSON.stringify([1, 3, 6, 12]),
      versions: JSON.stringify(['4.0', '3.5', '3.0'])
    },
    {
      name: 'Zoom Enterprise',
      description: 'Enterprise video conferencing and collaboration platform.',
      features: JSON.stringify([
        { name: 'Unlimited Minutes', description: 'No time limits on meetings' },
        { name: 'Large Meetings', description: 'Up to 1000 participants' },
        { name: 'Cloud Recording', description: 'Unlimited cloud storage' },
        { name: 'SSO Integration', description: 'Enterprise security features' }
      ]),
      durations: JSON.stringify([6, 12, 24, 36]),
      versions: JSON.stringify(['5.0.0', '6.0.0', '7.0.0'])
    },
    {
      name: 'Atlassian Suite',
      description: 'Complete suite of development and project management tools.',
      features: JSON.stringify([
        { name: 'Jira Software', description: 'Agile project management' },
        { name: 'Confluence', description: 'Team collaboration wiki' },
        { name: 'Bitbucket', description: 'Git code management' },
        { name: 'Trello Premium', description: 'Visual project management' }
      ]),
      durations: JSON.stringify([3, 6, 12, 24]),
      versions: JSON.stringify(['2023', '2024'])
    },
    {
      name: 'AWS Enterprise',
      description: 'Enterprise cloud computing and services platform.',
      features: JSON.stringify([
        { name: 'Dedicated Support', description: '24/7 enterprise support' },
        { name: 'Reserved Instances', description: 'Discounted compute pricing' },
        { name: 'Enterprise Security', description: 'Advanced security features' },
        { name: 'Training Access', description: 'AWS certification training' }
      ]),
      durations: JSON.stringify([12, 24, 36, 48]),
      versions: JSON.stringify(['2023', '2024'])
    },
    {
      name: 'GitHub Enterprise',
      description: 'Enterprise software development platform.',
      features: JSON.stringify([
        { name: 'SAML SSO', description: 'Enterprise authentication' },
        { name: 'Advanced Security', description: 'Security vulnerability analysis' },
        { name: 'Actions', description: 'CI/CD automation' },
        { name: 'Packages', description: 'Package hosting' }
      ]),
      durations: JSON.stringify([12, 24, 36]),
      versions: JSON.stringify(['2023.1', '2023.2', '2024.1'])
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });