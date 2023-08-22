const fs = require('fs');
const processImages = require('./processImages')
let carouselCSS =''
// Usage example

// finds the best crop of src and writes the cropped and resized image to dest.


// Function to generate the carousel HTML
function generateCarousel(images) {
  let carouselHTML = `
    <div id="carouselExampleIndicators" class="carousel slide carousel-fade col" data-bs-ride="carousel" data-bs-interval="3000">
      <ol class="carousel-indicators">
  `;

  images.forEach((image, index) => {
    carouselHTML += `
      <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}></li>
    `;
  });

  carouselHTML += `
      </ol>
      <div class="carousel-inner">
  `;

  images.forEach((image, index) => {
    carouselHTML += `
      <div class="carousel-item ${index === 0 ? 'active' : ''}" id="car${index + 1}">

      </div>
    `;
    carouselCSS += `
    #car${index + 1} {
      background: url("../${image.replaceAll('\\','/')}?as=webp");
      background-size: cover;
      -moz-background-size: cover;
    }

    `;
  });

  carouselHTML += `
      </div>
    </div>
  `;

  return carouselHTML;
}

// Function to export the carousel HTML to a file
function exportCarouselToHTML(carouselHTML, outputFile) {
  fs.writeFileSync(outputFile, carouselHTML);
  console.log(`Carousel exported to ${outputFile}`);
}

function exportCarouselToCSS(carouselCSS, outputCSS) {
  fs.writeFileSync(outputCSS,carouselCSS);
  console.log(`Carousel exported to ${outputCSS}`)
}

// Main function
function main() {
  const outputFile = 'src/components/carousel.htm';
  const folderPath = 'images/carousel';
  const images = processImages(folderPath);
  const carouselHTML = generateCarousel(images);
  exportCarouselToHTML(carouselHTML, outputFile);
  const outputCSS = 'css/carousel.css'
  exportCarouselToCSS(carouselCSS,outputCSS)
}



// Run the main function
main();
