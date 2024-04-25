import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as databaseRef, get, orderByChild, child, query, equalTo } from 'firebase/database';
import { database } from '../firebaseconfig';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft, faInfo,  faComments, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import logoImage from "../images/hlogo.png";

function HomeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    specialization: '',
    gender: '',
    language: '',
  });


  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const currentSearchTerm = searchTerm.trim().toLowerCase();
        const specialistsRef = child(databaseRef(database), 'specialists');

        const acceptedSpecialistsQuery = query(
          specialistsRef,
          orderByChild('status'),
          equalTo('Accepted') // Assuming 'Accepted' is the correct status value in your database
        );

        const snapshot = await get(acceptedSpecialistsQuery);

        if (snapshot.exists()) {
          const specialistsData = [];
          snapshot.forEach((childSnapshot) => {
            const specialist = childSnapshot.val();

            // Ensure the necessary properties exist before accessing them
            const name = `${specialist.firstName} ${specialist.surname}`;

            const matchesFilters = (
              (filters.location === '' || specialist.location.toLowerCase().includes(filters.location.toLowerCase())) &&
              (filters.specialization === '' || specialist.speciality.toLowerCase().includes(filters.specialization.toLowerCase())) &&
              (filters.gender === '' || specialist.gender.toLowerCase() === filters.gender.toLowerCase()) &&
              (filters.language === '' || specialist.language.toLowerCase().includes(filters.language.toLowerCase()))
            );
             

            if (
              matchesFilters &&
              (currentSearchTerm === '' ||
                (specialist.firstName && specialist.firstName.toLowerCase().includes(currentSearchTerm)) ||
                (specialist.surname && specialist.surname.toLowerCase().includes(currentSearchTerm)) ||
                (`${specialist.firstName} ${specialist.surname}`.toLowerCase().includes(currentSearchTerm)) ||
                (specialist.speciality && specialist.speciality.toLowerCase().includes(currentSearchTerm))
              )

            ) {
              specialistsData.push({
                id: childSnapshot.key,
                name: name,
                passportPhotoUrl: specialist.passportPhotoUrl,
                qualification: specialist.qualification || '', 
                yearsOfExperience: specialist.yearsOfExperience || '', 
                language: specialist.language || '' ,
                location: specialist.location || '' ,
                speciality: specialist.speciality || '' ,
              });
            }
          });
          setSearchResults(specialistsData);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching specialists:', error);
      }
    };

    fetchSpecialists();
  }, [searchTerm, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div style={{ backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '10px 20px' }}>
        <div style={{ flex: 1 }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
         <FontAwesomeIcon
          icon={faCircleLeft}
          style={{ fontSize: '24px', marginRight: '10px', cursor: 'pointer' }}
          />
          </a>
          {/* Add other elements for left side */}
        </div>
        <div style={{ flex: 2, textAlign: 'center' }}>
          {/* Logo or title in the middle */}
          <img src={logoImage} alt="MIMS Logo" className="nav-logo" style={{ width: '150px', height: 'auto' }}/>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <FontAwesomeIcon icon={faInfo} style={{ fontSize: '24px', cursor: 'pointer' }} />
          {/* Add other elements for right side */}
        </div>
      </nav>

      {/* Search Bar */}
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <input
          type="text"
          placeholder="Search for specialists by name or specialty"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '15px',
            width: '30%',
            borderRadius: '5px',
            border: '1px solid #007BFF',
            fontSize: '16px',
            marginLeft: '600px'
          }}
        />
      </div>

      <div style={{ display: 'flex',marginLeft:'100px',marginTop:'' }}>
        {/* Filter Panel */}
        <div
          style={{
            marginTop:'50px',
            width: '30%',
            height:'50%',
            padding: '20px',
            border: '1px solid #007BFF',
            background: '#fff',
            borderRadius:'12px',
          
          }}
        >
          <h3 style={{ fontFamily: "Lora, serif", color: "#007BFF",marginLeft:'100px',fontSize:'30px'}}>Filters</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              style={{
                padding: '10px',
                width: '100%',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Specialization:</label>
            <input
              type="text"
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              style={{
                padding: '10px',
                width: '100%',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Gender:</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              style={{
                padding: '10px',
                width: '100%',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            >
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Language:</label>
            <input
              type="text"
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              style={{
                padding: '10px',
                width: '100%',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
        </div>



 {/* Specialist Cards */}
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', width: '100%', overflow: 'hidden' ,marginRight:'350px'}}>
  <h2>Search Results</h2>
  {searchResults.map((specialist) => (
    <div key={specialist.id} style={{ display: 'flex', width: '80%', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden',background:'#ffffff' }}>
      {/* Image container on the left */}
      <div style={{ width: '25%', position: 'relative', marginRight: '20px', marginLeft: '10px', marginTop: '10px', marginBottom: '50px' }}>
        <img src={specialist.passportPhotoUrl} alt={""} style={{ width: '100%', height: 'auto', maxHeight: '200px',borderRadius:'10px' }} />

        {/* Years of Experience box */}
        <div style={{ 
          position: 'absolute',
         // Place the box at the bottom
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '5px', // Add space between the image and the box
          backgroundColor: '#87CEEB', // Light blue color
          padding: '5px 10px',
          borderRadius: '10px',
          color: '#fff', // Text color
          fontSize: '14px', // Adjust font size as needed
        }}>
          {specialist.yearsOfExperience} years exp
        </div>
      </div>



      {/* Details on the right */}
      <div style={{ padding: '15px', width: '40%', marginTop: '20px', boxSizing: 'border-box', fontFamily: "Lora, serif" }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '25px' }}>{`Dr. ${specialist.name}`}</h3>
        <h3>{specialist.qualification}</h3>
        <h3 style={{ marginTop: '10px' }}>{specialist.speciality}</h3>
        <h3>{specialist.experience}</h3>
        <h3>
          <FontAwesomeIcon icon={faComments} style={{ marginRight: '5px', color: "#007BFF", marginTop: '10px' }} />
          {specialist.language}
        </h3>
        <h3>
          <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '5px', color: "#CCCCCC", marginTop: '10px' }} />
          {specialist.location}
        </h3>
        {/* Show More button */}
        <Link to={`/show-more/${specialist.id}`}>
        <button style={{ marginTop: '10px', marginLeft: '350px',width:'140px',height:'50px', backgroundColor: '#87CEEB', color: '#fff', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer',fontSize:'18px' }}>
          Show More
        </button>
        </Link>
      </div>
    </div>
  ))}
</div>
</div>
</div>
  );
}

export default HomeSearch;
