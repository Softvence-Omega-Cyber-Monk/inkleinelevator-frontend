export const jobDetailsData = {
  jobs: [
    {
      id: 1,
      title: "Elevator Modernization - Tower A",
      type: "Modernization",
      postedDate: "2 days ago",
      location: {
        address: "123 Main Street, New York, 10001",
        street: "123 Main Street",
        city: "New York",
        zipCode: "10001",
      },
      budget: {
        min: 180000,
        max: 220000,
        display: "$180,000 - $220,000",
      },
      description: "Complete modernization of 8 passenger elevators in a 25-story office building.",
      tasks: [
        "Upgrade to destination dispatch technology",
        "Install new LED lighting and touchscreen panels",
        "Replace all motors and drives for improved efficiency",
        "Update safety systems to current ASME A17.1 standards",
      ],
      technicalRequirements: [
        "Licensed Elevator Contractor",
        "ASME A17.1 Certified",
        "DEI Certification",
        "$1M Insurance Required",
      ],
      elevatorSpecifications: {
        type: "Traction (Geared)",
        numberOfUnits: 8,
        capacity: "3,500 lbs each",
        speed: "500 FPM",
      },
      photos: [
        {
          name: "Photo.jpg",
          url: "https://images.unsplash.com/photo-1766548729658-0ce12fd07af8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        },
        {
          name: "Photo.jpg",
          url: "https://images.unsplash.com/photo-1761839258830-81f87b1c6d62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
        },
      ],
      documents: [
        {
          name: "Building_Elevator_Specs.pdf",
          url: "#",
        },
        {
          name: "Building_Elevator_Specs.pdf",
          url: "#",
        },
      ],
      contactInfo: {
        company: "Metropolitan Property Management LLC",
        contact: "Sarah Johnson",
        phone: "(212) 555-0187",
      },
      status: "Active",
      statusColor: "bg-orange-500",
    },
    {
      id: 2,
      title: "Monthly Maintenance Contract - 12 Elevators",
      type: "Maintenance",
      postedDate: "5 days ago",
      location: {
        address: "456 Broadway Avenue, Brooklyn, 11201",
        street: "456 Broadway Avenue",
        city: "Brooklyn",
        zipCode: "11201",
      },
      budget: {
        min: 150000,
        max: 200000,
        display: "$150,000 - $200,000",
      },
      description: "Monthly maintenance contract for 12 passenger elevators in a commercial building complex. Includes routine inspections, cleaning, and preventive maintenance.",
      tasks: [
        "Monthly inspection and testing of all safety systems",
        "Regular cleaning and lubrication of mechanical components",
        "24/7 emergency response service",
        "Quarterly safety audits and compliance reports",
      ],
      technicalRequirements: [
        "Licensed Elevator Contractor",
        "ASME A17.1 Certified",
        "QEI Certification",
        "$2M Insurance Required",
      ],
      elevatorSpecifications: {
        type: "Hydraulic",
        numberOfUnits: 12,
        capacity: "2,500 lbs each",
        speed: "150 FPM",
      },
      photos: [
        {
          name: "Photo.jpg",
          url: "https://images.unsplash.com/photo-1766543497004-2fd76e88f605?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Photo.jpg",
          url: "https://images.unsplash.com/photo-1761839258044-e59f324b5a7f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      documents: [
        {
          name: "Maintenance_Contract_Terms.pdf",
          url: "#",
        },
        {
          name: "Building_Layout.pdf",
          url: "#",
        },
      ],
      contactInfo: {
        company: "Brooklyn Commercial Properties Inc",
        contact: "Michael Chen",
        phone: "(718) 555-0234",
      },
      status: "Completed",
      statusColor: "bg-green-500",
    },
    {
      id: 3,
      title: "Emergency Elevator Repair - Service Shaft",
      type: "Repairs",
      postedDate: "1 day ago",
      location: {
        address: "789 Park Avenue, Manhattan, 10021",
        street: "789 Park Avenue",
        city: "Manhattan",
        zipCode: "10021",
      },
      budget: {
        min: 75000,
        max: 120000,
        display: "$75,000 - $120,000",
      },
      description: "Urgent repair work needed for service elevator in residential building. Motor replacement and control system upgrade required.",
      tasks: [
        "Replace failed motor and drive system",
        "Upgrade control panel to modern digital system",
        "Install new safety sensors and emergency stop",
        "Complete system testing and certification",
      ],
      technicalRequirements: [
        "Licensed Elevator Contractor",
        "ASME A17.1 Certified",
        "Emergency Service Certified",
        "$1.5M Insurance Required",
      ],
      elevatorSpecifications: {
        type: "Traction (Gearless)",
        numberOfUnits: 1,
        capacity: "5,000 lbs",
        speed: "700 FPM",
      },
      photos: [
        {
          name: "Photo.jpg",
          url: "https://images.unsplash.com/photo-1766469284258-11bf4223e2af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1NXx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Photo.jpg",
          url: "https://images.unsplash.com/photo-1766548729658-0ce12fd07af8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        },
      ],
      documents: [
        {
          name: "Repair_Assessment_Report.pdf",
          url: "#",
        },
        {
          name: "Service_Elevator_Specs.pdf",
          url: "#",
        },
      ],
      contactInfo: {
        company: "Park Avenue Residential Management",
        contact: "Emily Rodriguez",
        phone: "(212) 555-0456",
      },
      status: "In Progress",
      statusColor: "bg-blue-500",
    },
  ],
  // Helper function to get job by ID
  getJobById: (id: number | string) => {
    return jobDetailsData.jobs.find((job) => job.id === Number(id));
  },
};
