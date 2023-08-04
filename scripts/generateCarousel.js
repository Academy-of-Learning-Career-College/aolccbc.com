const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const smartcrop = require('smartcrop-sharp');
const folderPath = 'images/carousel';
const squareFolder = 'images/carousel/square';

if (!fs.existsSync(squareFolder)) {
  fs.mkdirSync(squareFolder);
}
// finds the best crop of src and writes the cropped and resized image to dest.
function applySmartCrop(src, dest, width, height) {
  return smartcrop.crop(src, { width: width, height: height })
    .then(function(result) {
      const crop = result.topCrop;
      return sharp(src)
        .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
        .resize(width, height)
        .toFile(dest);
    })
}




// Function to find all images in a folder
function findImages(folderPath) {
  const images = [];
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    const square = path.join(squareFolder,file);
    if (stat.isFile() && isImage(file)) {
      images.push(square);
      applySmartCrop(filePath, square, 1000, 1000);
    }
  });

  return images;
}

// Function to check if a file is an image
function isImage(file) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
}

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

  const images = findImages(folderPath);
  const carouselHTML = generateCarousel(images);
  exportCarouselToHTML(carouselHTML, outputFile);
}

// Run the main function
main();
