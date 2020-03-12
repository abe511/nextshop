function catchErrors(error, displayError) {
  let errorMessage = '';
  if (error.response) {
    // request sent, but server response status code not in the range of 2XX
    errorMessage = error.response.data;
    console.error('Error response', errorMessage);

    // CLOUDINARY image upload error
    if (error.response.data.error) {
      errorMessage = error.response.data.error.message;
      console.error('Response data error', error.response.data.error.message);
    }
  } else if (error.request) {
    // request sent, but no response received
    errorMessage = error.request.data;
    console.error('Error request', errorMessage);
  } else {
    // something else in making the request that caused an error
    errorMessage = error.message;
    console.error('Error message', errorMessage);
  }
  displayError(errorMessage);
}

export default catchErrors;
