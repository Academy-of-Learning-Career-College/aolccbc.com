const fs = require('fs');
const processImages = require('./processImages')

// Usage example

// finds the best crop of src and writes the cropped and resized image to dest.


// Function to generate the carousel HTML
function generateCarousel(images) {
  let carouselHTML = `
    <div id="carouselExampleIndicators" class="carousel slide col" data-bs-ride="carousel" data-bs-interval="6000">
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
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="~/${image.replace('\\','/')}?as=webp&height=625.797" class="d-block" alt="funky Image ${index + 1}">
      </div>
    `;
  });

  carouselHTML += `
      </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </a>
    </div>
  `;

  return carouselHTML;
}

// Function to export the carousel HTML to a file
function exportCarouselToHTML(carouselHTML, outputFile) {
  fs.writeFileSync(outputFile, carouselHTML);
  console.log(`Carousel exported to ${outputFile}`);
}

// Main function
function main() {
  const outputFile = 'src/components/carousel.htm';
  const folderPath = 'images/carousel';
  const images = processImages(folderPath);
  const carouselHTML = generateCarousel(images);
  exportCarouselToHTML(carouselHTML, outputFile);
}



// Run the main function
main();
