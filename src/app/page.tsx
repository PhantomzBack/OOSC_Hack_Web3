"use client"

import { ChangeEvent, FormEvent, useState } from 'react';
import { create } from 'ipfs-http-client';
export default function Home() {
  const [currentSection, setCurrentSection] = useState('register');
  const [courses, setCourses] = useState([
    { id: 1, name: 'React Basics', visible: true },
    { id: 2, name: 'Advanced Next.js', visible: true },
    { id: 3, name: 'JavaScript Essentials', visible: true },
  ]);
  const isAdmin = true; // Example condition

  const renderSection = () => {
    switch (currentSection) {
      case 'register':
        return <RegisterInstitute />;
      case 'issue':
        return <IssueCertificate contract={undefined} account={''} />;
      case 'view':
        return <ViewCertificates />;
      case 'visibility':
        return <Visibility />;
      default:
        return <RegisterInstitute />;
    }
  };

  function RegisterInstitute() {
    return (
      <form className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Register Institute</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Institute Name</label>
          <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Institute Address</label>
          <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Institute Acronym</label>
          <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
          Register
        </button>
      </form>
    );
  }

  interface IssueCertificateProps {
    contract: any;
    account: string;
  }
  const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
  function IssueCertificate({ contract, account }: IssueCertificateProps) {
    const [ipfsHash, setIpfsHash] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
  
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFile(event.target.files[0]);
      }
    };
  
    const uploadToIPFS = async () => {
      try {
        if (file) {
          const added = await client.add(file);
          setIpfsHash(added.path);
        }
      } catch (error) {
        console.error('Error uploading file: ', error);
      }
    };
  
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const id = (form[0] as HTMLInputElement).value;
      const candidateName = (form[1] as HTMLInputElement).value;
      const courseIndex = parseInt((form[2] as HTMLInputElement).value);
      const creationDate = (form[3] as HTMLInputElement).value;
  
      try {
        await contract.methods.generateCertificate(
          id,
          candidateName,
          courseIndex,
          creationDate,
          ipfsHash
        ).send({ from: account });
        alert('Certificate issued successfully!');
      } catch (error) {
        console.error('Error issuing certificate: ', error);
      }
    };
  return (
    <form className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-black">Issue Certificate</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ID</label>
        <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
        <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Course Name</label>
        <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Issue Date</label>
        <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Certificate Photo</label>
        <input type="file" onChange={handleFileChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        <button type="button" onClick={uploadToIPFS} className="mt-2 bg-blue-600 text-white p-2 rounded-md">
          Upload to IPFS
        </button>
      </div>
      {ipfsHash && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">IPFS Hash</label>
          <input type="text" value={ipfsHash} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
      )}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
        Issue Certificate
      </button>
    </form>
  );
}

  function ViewCertificates() {
    const [certificates] = useState([
      { id: 1, name: 'John Doe', course: 'React Basics', date: '2023-01-10' },
      { id: 2, name: 'Jane Smith', course: 'Advanced Next.js', date: '2023-02-15' },
    ]);

    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">User Certificates</h2>
        <ul>
          {certificates.map((cert) => (
            <li key={cert.id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold">{cert.name}</div>
                  <div className="text-sm text-gray-600">{cert.course}</div>
                  <div className="text-sm text-gray-500">{cert.date}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function Visibility() {
    const toggleCourseVisibility = (id: number) => {
      setCourses(courses.map(course => course.id === id ? { ...course, visible: !course.visible } : course));
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Toggle Course Visibility</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id} className="flex justify-between items-center mb-4">
              <span>{course.name}</span>
              <button
                onClick={() => toggleCourseVisibility(course.id)}
                className={`p-2 rounded-md ${course.visible ? 'bg-green-500' : 'bg-red-500'} text-white`}
              >
                {course.visible ? 'Visible' : 'Hidden'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <ul className="flex space-x-4 justify-center">
          <li onClick={() => setCurrentSection('register')} className={`cursor-pointer ${currentSection === 'register' ? 'text-xl' : ''} hover:text-blue-800 hover:scale-105 transition-all`}>
            Register Institute
          </li>
          {isAdmin ? (
            <li onClick={() => setCurrentSection('issue')} className={`cursor-pointer ${currentSection === 'issue' ? 'text-xl' : ''} hover:text-blue-800 hover:scale-105 transition-all`}>
              Issue Certificate
            </li>
          ) : (
            <li onClick={() => setCurrentSection('visibility')} className={`cursor-pointer ${currentSection === 'visibility' ? 'text-xl' : ''} hover:text-blue-800 hover:scale-105 transition-all`}>
              Visibility
            </li>
          )}
          <li onClick={() => setCurrentSection('view')} className={`cursor-pointer ${currentSection === 'view' ? 'text-xl' : ''} hover:text-blue-800 hover:scale-105 transition-all`}>
            View Certificates
          </li>
        </ul>
      </nav>
      <div className="p-8">{renderSection()}</div>
    </div>
  );
}