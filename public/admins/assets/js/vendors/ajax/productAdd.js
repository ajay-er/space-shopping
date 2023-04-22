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
