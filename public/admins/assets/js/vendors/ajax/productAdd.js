//add-products
const form = document.getElementById('myForm');
const submitButton = document.getElementById('add-product-btn');

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  const formData = new FormData(form);

  const productName = document.getElementById('productName').value;
  const productDescription =
    document.getElementById('productDescription').value;
  const productPrice = document.getElementById('productPrice').value;
  const productOldPrice = document.getElementById('productOldPrice').value;
  const stocks = document.getElementById('stocks').value;
  const productCategory = document.getElementById('productCategory').value;

  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productOldPrice ||
    !stocks ||
    productCategory === 'Add to Category'
  ) {
    callAlertify('warning', 'Please fill in all required fields');
    setTimeout(() => {
      submitButton.disabled = false;
    }, 3000);
    return;
  }

  const url = '/admin/add-products';
  submitButton.disabled = true;

  axios
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log('Product added successfully!');
      submitButton.disabled = false;
      callAlertify('success', 'Product added successfully!');
      event.target.form.reset();
    })
    .catch((error) => {
      callAlertify('error', 'Error adding product');
      submitButton.disabled = false;
      console.error('Error adding product:', error);
    });
});

// //image section
// const imagePreview = document.getElementById('image-preview');
// const fileInput = document.getElementById('productImage');

// fileInput.addEventListener('change', (event) => {
//   const fileList = event.target.files;
  
//   // Clear the preview
//   imagePreview.innerHTML = '';
  
//   // Loop through the file list and display each image
//   for (let i = 0; i < fileList.length; i++) {
//     const file = fileList[i];
    
//     // Create a new image element
//     const image = document.createElement('img');
//     image.classList.add('preview-image');
//     image.file = file;
    
//     // Create a remove button for the image
//     const removeButton = document.createElement('button');
//     removeButton.classList.add('btn', 'btn-danger', 'mt-2');
//     removeButton.innerText = 'Remove';
//     removeButton.addEventListener('click', (event) => {
//       event.preventDefault();
//       imagePreview.removeChild(imageContainer);
//     });
    
//     // Create a container for the image and remove button
//     const imageContainer = document.createElement('div');
//     imageContainer.classList.add('preview-image-container');
//     imageContainer.appendChild(image);
//     imageContainer.appendChild(removeButton);
    
//     // Add the container to the preview
//     imagePreview.appendChild(imageContainer);
    
//     // Display the image
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       image.src = event.target.result;
//     };
//     reader.readAsDataURL(file);
//   }
// });
