// API Configuration
const RAPID_API_KEY = 'e7a7fb18bbmsha4835e94ea253cap1bc568jsn1c3b03f87ce1';
const JSEARCH_API_HOST = 'jsearch.p.rapidapi.com';
const INDEED_API_HOST = 'indeed12.p.rapidapi.com';

// Function to fetch internships from JSearch API
async function fetchJSearchInternships() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': JSEARCH_API_HOST
        }
    };

    try {
        const response = await fetch(
            'https://jsearch.p.rapidapi.com/search?query=internship%20in%20india&page=1&num_pages=2&country=IN',
            options
        );
        const data = await response.json();
        
        if (!data.data) {
            return [];
        }

        return data.data
            .filter(job => 
                job.job_country === 'IN' || 
                job.job_country === 'India' ||
                (job.job_google_link && job.job_google_link.includes('india'))
            )
            .map(job => ({
                source: 'JSearch',
                title: job.job_title || 'Internship Position',
                company: job.employer_name || 'Company Name',
                logo: job.employer_logo || 'images/default-company.png',
                location: job.job_city ? `${job.job_city}, India` : 'India',
                duration: job.job_employment_type || 'Duration not specified',
                type: job.job_employment_type || 'Not specified',
                stipend: job.job_min_salary ? `₹${job.job_min_salary} - ₹${job.job_max_salary}` : 'Stipend not specified',
                field: job.job_title.split(' ')[0] || 'Various',
                requirements: job.job_required_skills ? job.job_required_skills.split(',').map(skill => skill.trim()) : [],
                description: job.job_description || 'No description available',
                postedDate: job.job_posted_at_datetime || new Date().toISOString(),
                applyLink: job.job_apply_link || '#'
            }));
    } catch (error) {
        console.error('Error fetching from JSearch:', error);
        return [];
    }
}

// Function to fetch internships from Indeed API
async function fetchIndeedInternships() {
    // Extended list of top Indian companies
    const companies = [
        'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech-Mahindra', 
        'Microsoft-India', 'Google-India', 'Amazon-India',
        'Accenture-India', 'IBM-India', 'Cognizant-India',
        'Deloitte-India', 'Oracle-India', 'SAP-India',
        'Adobe-India', 'Capgemini-India', 'Dell-India',
        'Intel-India', 'Samsung-India', 'Cisco-India'
    ];

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': INDEED_API_HOST
        }
    };

    try {
        const allJobs = [];
        const fetchPromises = companies.map(async (company) => {
            try {
                const response = await fetch(
                    `https://indeed12.p.rapidapi.com/company/${company}/jobs?locality=in&start=1`,
                    options
                );
                const data = await response.json();
                
                if (data && data.jobs) {
                    const internships = data.jobs
                        .filter(job => {
                            const title = job.title.toLowerCase();
                            return (
                                (title.includes('intern') || 
                                title.includes('internship') || 
                                title.includes('trainee')) &&
                                (job.location.toLowerCase().includes('india') ||
                                job.location.toLowerCase().includes('remote'))
                            );
                        })
                        .map(job => ({
                            source: 'Indeed',
                            title: job.title || 'Internship Position',
                            company: job.company || company.replace('-India', ''),
                            logo: job.companyLogo || 'images/default-company.png',
                            location: job.location || 'India',
                            duration: 'Internship',
                            type: job.type || 'Full-time',
                            stipend: job.salary || 'Stipend not specified',
                            field: determineField(job.title),
                            requirements: extractRequirements(job.description || ''),
                            description: job.description || 'No description available',
                            postedDate: job.date || new Date().toISOString(),
                            applyLink: job.link || '#'
                        }));
                    return internships;
                }
                return [];
            } catch (error) {
                console.error(`Error fetching from Indeed for ${company}:`, error);
                return [];
            }
        });

        const results = await Promise.allSettled(fetchPromises);
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                allJobs.push(...result.value);
            }
        });

        return allJobs;
    } catch (error) {
        console.error('Error fetching from Indeed:', error);
        return [];
    }
}

// Helper function to determine field from job title
function determineField(title) {
    const title_lower = title.toLowerCase();
    if (title_lower.includes('software') || title_lower.includes('developer')) return 'Software Development';
    if (title_lower.includes('data')) return 'Data Science';
    if (title_lower.includes('web')) return 'Web Development';
    if (title_lower.includes('machine learning') || title_lower.includes('ml')) return 'Machine Learning';
    if (title_lower.includes('ui') || title_lower.includes('ux')) return 'UI/UX Design';
    if (title_lower.includes('cloud')) return 'Cloud Computing';
    if (title_lower.includes('security')) return 'Cybersecurity';
    if (title_lower.includes('marketing')) return 'Digital Marketing';
    if (title_lower.includes('product')) return 'Product Management';
    return 'Various';
}

// Helper function to extract requirements from description
function extractRequirements(description) {
    const commonSkills = [
        'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL',
        'AWS', 'Azure', 'Git', 'Docker', 'Kubernetes', 'HTML',
        'CSS', 'Angular', 'Vue.js', 'TypeScript', 'C++', 'C#',
        'Machine Learning', 'AI', 'Data Analysis', 'R', 'Tableau',
        'Power BI', 'Excel', 'Communication', 'Problem Solving'
    ];

    return commonSkills.filter(skill => 
        description.toLowerCase().includes(skill.toLowerCase())
    );
}

// Function to fetch all internships from multiple sources
async function fetchAllInternships() {
    try {
        const [jSearchJobs, indeedJobs] = await Promise.all([
            fetchJSearchInternships(),
            fetchIndeedInternships()
        ]);

        // Combine and sort all internships by date
        const allInternships = [...jSearchJobs, ...indeedJobs];
        return allInternships.sort((a, b) => 
            new Date(b.postedDate) - new Date(a.postedDate)
        );
    } catch (error) {
        console.error('Error fetching all internships:', error);
        return [];
    }
}

// Export the API functions
window.InternshipAPI = {
    fetchAllInternships
}; 