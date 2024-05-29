const fs = require('fs');
const cheerio = require('cheerio'); // You need to install Cheerio: npm install cheerio

// Read data from index.html and dashboard.html
const indexData = fs.readFileSync('index.html', 'utf8');
const dashboardData = fs.readFileSync('dashboard.html', 'utf8');

// Extract categories data from index.html
const indexCategories = extractCategories(indexData);

// Extract categories data from dashboard.html
const dashboardCategories = extractCategories(dashboardData);

// Combine categories data from both files
const allCategories = [...indexCategories, ...dashboardCategories];

// Write categories data to data.json
fs.writeFileSync('data.json', JSON.stringify(allCategories, null, 2));

console.log('Data successfully written to data.json');

// Function to extract categories data from HTML
function extractCategories(htmlData) {
    const $ = cheerio.load(htmlData);
    const categories = [];
    
    $('.category').each((index, element) => {
        const category = {
            name: $(element).find('h2').text(),
            products: []
        };

        $(element).find('.product').each((index, productElement) => {
            const product = {
                name: $(productElement).find('p').eq(0).text(),
                price: $(productElement).find('p').eq(1).text().replace('€', ''),
                description: $(productElement).find('.product-description').text()
            };
            category.products.push(product);
        });

        categories.push(category);
    });

    return categories;
}
