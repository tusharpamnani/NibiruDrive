import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

// Function to upload file to IPFS
async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        pinata_api_key: 'b9e8e35f464c867139c9', // Replace with your Pinata API key
        pinata_secret_api_key: '676dc80a69fb7187a93e5e210f68e0e19fa07e7bfea900fd6686489bdd1f0ed4', // Replace with your Pinata secret API key
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.IpfsHash; // Return the IPFS hash
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

// Function to handle file upload and send transaction
async function handleUpload(file, contract, account) {
  try {
    // Upload file to IPFS and get the IPFS hash
    const ipfsHash = await uploadToIPFS(file);

    // Create transaction data
    const txData = {
      to: contract.address, // Your contract address
      value: '0', // Adjust value if necessary
      data: ipfsHash, // Include IPFS hash or other data
    };

    // Send transaction request to your server
    const response = await axios.post('http://localhost:3001/sendTransaction', txData);
    console.log('Transaction hash:', response.data.txHash);
  } catch (error) {
    console.error('Error handling upload:', error);
    throw new Error('Failed to handle file upload and transaction');
  }
}

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        await handleUpload(file, contract, account);
        alert("Successfully Image Uploaded and Transaction Sent");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image and send transaction");
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    setFile(data);
    setFileName(data.name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;


// import { useState } from "react";
// import axios from "axios";
// import "./FileUpload.css";
// function FileUpload({ contract, provider, account }) {
//   // const [urlArr, setUrlArr] = useState([]);
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No image selected");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (file) {
//         try {
//           const formData = new FormData();
//           formData.append("file", file);

//           const resFile = await axios({
//             method: "post",
//             url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//             data: formData,
//             headers: {
//               pinata_api_key: `95f328a012f1634eab8b`,
//               pinata_secret_api_key: `8ea64e6b39c91631c66128a7c0e0dde35a6fbdf797a8393cc5ba8bf8d58e9b54`,
//               "Content-Type": "multipart/form-data",
//             },
//           });

//           const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
//           const signer = contract.connect(provider.getSigner());
//           signer.add(account, ImgHash);

//           //setUrlArr((prev) => [...prev, ImgHash]);

//           //Take a look at your Pinata Pinned section, you will see a new file added to you list.
//         } catch (error) {
//           alert("Error sending File to IPFS");
//           console.log(error);
//         }
//       }

//       alert("Successfully Uploaded");
//       setFileName("No image selected");
//       setFile(null); //to again disable the upload button after upload
//     } catch (error) {
//       console.log(error.message); //this mostly occurse when net is not working
//     }
//   };
//   const retrieveFile = (e) => {
//     const data = e.target.files[0];
//     console.log(data);

//     const reader = new window.FileReader();

//     reader.readAsArrayBuffer(data);
//     reader.onloadend = () => {
//       setFile(e.target.files[0]);
//     };
//     setFileName(e.target.files[0].name);
//     e.preventDefault();
//   };
//   return (
//     <div className="top">
//       <form className="form" onSubmit={handleSubmit}>
//         <label htmlFor="file-upload" className="choose">
//           {/*turn around for avoding choose file */}
//           Choose Image
//         </label>
//         <input
//           disabled={!account} //disabling button when metamask account is not connected
//           type="file"
//           id="file-upload"
//           name="data"
//           onChange={retrieveFile}
//         />
//         <span className="textArea">Image: {fileName}</span>
//         {/* choose file */}
//         <button type="submit" disabled={!file} className="upload">
//           Upload file
//         </button>
//       </form>
//     </div>
//   );
// }

// export default FileUpload;
