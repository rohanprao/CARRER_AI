document.addEventListener('DOMContentLoaded', function() {
    const uploadBox = document.querySelector('.upload-box');
    const fileInput = document.getElementById('resume-upload');
    const analysisResults = document.getElementById('analysis-results');
    let isProcessing = false; // Flag to prevent multiple simultaneous uploads
    
    // Initialize PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
    
    // Reset function to restore initial state
    function resetUploadState() {
        isProcessing = false;
        uploadBox.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <h3>Upload Your Resume</h3>
            <p>Drag and drop your resume here or click to browse</p>
            <input type="file" id="resume-upload" accept=".pdf,.docx" hidden>
            <label for="resume-upload" class="btn btn-primary">Choose File</label>
            <p class="file-info">Supported formats: PDF, DOCX (Max 5MB)</p>
        `;
        
        // Reattach event listener to new file input
        const newFileInput = document.getElementById('resume-upload');
        if (newFileInput) {
            newFileInput.addEventListener('change', handleFileInputChange);
        }
    }
    
    // Drag and drop functionality
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!isProcessing) {
            uploadBox.classList.add('drag-over');
        }
    });
    
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        
        if (isProcessing) {
            showError('Please wait for the current analysis to complete');
            return;
        }
        
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFileUpload(files[0]);
        }
    });
    
    // Click to upload functionality
    function handleFileInputChange(e) {
        if (isProcessing) {
            showError('Please wait for the current analysis to complete');
            return;
        }
        
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    }
    
    fileInput.addEventListener('change', handleFileInputChange);
    
    async function handleFileUpload(file) {
        try {
            if (isProcessing) {
                return;
            }
            
            isProcessing = true;
            
            // Reset previous results
            if (analysisResults) {
                analysisResults.style.display = 'none';
            }
            
            // Validate file type
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                showError('Please upload a PDF or DOCX file');
                isProcessing = false;
                return;
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showError('File size should be less than 5MB');
                isProcessing = false;
                return;
            }
            
            // Show loading state
            showLoading();
            
            let text = '';
            
            if (file.type === 'application/pdf') {
                text = await extractPdfText(file);
            } else {
                text = await extractDocxText(file);
            }
            
            if (!text || text.trim().length === 0) {
                throw new Error('No text content found in the file');
            }
            
            // Process the text with a small delay to prevent UI freezing
            setTimeout(() => {
                analyzeResume(text);
            }, 100);
            
        } catch (error) {
            console.error('Error processing file:', error);
            showError(error.message || 'Error processing file. Please try again.');
            isProcessing = false;
        }
    }
    
    async function extractPdfText(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n';
            }
            
            return text;
        } catch (error) {
            throw new Error('Error reading PDF file. Please ensure it\'s not corrupted.');
        }
    }
    
    async function extractDocxText(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        } catch (error) {
            throw new Error('Error reading DOCX file. Please ensure it\'s not corrupted.');
        }
    }
    
    function analyzeResume(text) {
        try {
            // Simple resume analysis logic
            const analysis = {
                score: 0,
                skills_analysis: {
                    technical_skills: 0,
                    skills_found: {}
                },
                experience_analysis: {
                    action_verbs_count: 0,
                    organizations_mentioned: 0
                },
                metrics: {
                    word_count: 0,
                    sentence_count: 0
                }
            };
            
            // Count words and sentences
            const words = text.trim().split(/\s+/);
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            analysis.metrics.word_count = words.length;
            analysis.metrics.sentence_count = sentences.length;
            
            // Detect technical skills
            const skillsPattern = /python|java|javascript|html|css|react|node\.js|sql|machine learning|data analysis|git/gi;
            const skills = text.match(skillsPattern) || [];
            const skillsCount = {};
            skills.forEach(skill => {
                const skillLower = skill.toLowerCase();
                skillsCount[skillLower] = (skillsCount[skillLower] || 0) + 1;
            });
            analysis.skills_analysis.technical_skills = Object.keys(skillsCount).length;
            analysis.skills_analysis.skills_found = skillsCount;
            
            // Count action verbs
            const actionVerbs = /developed|created|implemented|managed|led|designed|built|analyzed|improved|increased/gi;
            const actionVerbMatches = text.match(actionVerbs) || [];
            analysis.experience_analysis.action_verbs_count = actionVerbMatches.length;
            
            // Count potential organizations
            const orgPattern = /\b[A-Z][a-zA-Z]+ (?:[A-Z][a-zA-Z]+\s?)*(?:Inc\.|Corp\.|Ltd\.|LLC|Company|Technologies|Solutions)\b/g;
            const organizations = text.match(orgPattern) || [];
            analysis.experience_analysis.organizations_mentioned = organizations.length;
            
            // Calculate overall score
            analysis.score = Math.min(100, (
                analysis.skills_analysis.technical_skills * 10 +
                Math.min(50, analysis.experience_analysis.action_verbs_count * 5) +
                Math.min(20, analysis.experience_analysis.organizations_mentioned) +
                Math.min(20, analysis.metrics.sentence_count / 5)
            ));
            
            // Display results with a small delay to ensure smooth UI update
            setTimeout(() => {
                displayResults(analysis);
                isProcessing = false; // Reset processing flag after analysis is complete
            }, 100);
            
        } catch (error) {
            console.error('Error analyzing resume:', error);
            showError('Error analyzing resume content. Please try again.');
            isProcessing = false;
        }
    }
    
    function showLoading() {
        uploadBox.innerHTML = `
            <div class="loading-container">
                <i class="fas fa-spinner fa-spin"></i>
                <h3>Analyzing your resume...</h3>
                <p>This may take a few moments</p>
                <div class="loading-progress"></div>
                <button class="btn btn-secondary cancel-button" onclick="resetUploadState()">Cancel</button>
            </div>
        `;
    }
    
    function showError(message) {
        uploadBox.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <label for="resume-upload" class="btn btn-primary">Try Again</label>
            </div>
        `;
        
        // Reset file input and processing flag
        if (fileInput) {
            fileInput.value = '';
        }
        isProcessing = false;
        
        // Reattach event listener
        resetUploadState();
    }
    
    function displayResults(data) {
        // Reset upload box to initial state
        resetUploadState();
        
        // Show results section
        if (analysisResults) {
            // Clear previous results first
            analysisResults.innerHTML = '';
            analysisResults.style.display = 'block';
            
            // Create main results container
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-container';
            
            // Score Section
            const scoreSection = document.createElement('div');
            scoreSection.className = 'score-section';
            scoreSection.innerHTML = `
                <div class="score-circle-container">
                    <svg class="circular-chart" viewBox="0 0 100 100">
                        <circle class="circle-bg" cx="50" cy="50" r="45"/>
                        <circle class="circle" cx="50" cy="50" r="45"/>
                    </svg>
                    <div class="score">${Math.round(data.score)}</div>
                </div>
                <h3>Resume Score</h3>
            `;
            
            // Skills Analysis Section
            const skillsSection = document.createElement('div');
            skillsSection.className = 'skills-analysis-section';
            skillsSection.innerHTML = `
                <h3>Skills Analysis</h3>
                <div class="skill-bars">
                    <div class="skill-bar">
                        <div class="skill-info">
                            <span>Technical Skills</span>
                            <span class="skill-percentage">${Math.min(100, (data.skills_analysis.technical_skills / 10) * 100)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(100, (data.skills_analysis.technical_skills / 10) * 100)}%"></div>
                        </div>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-info">
                            <span>Experience Description</span>
                            <span class="skill-percentage">${Math.min(100, (data.experience_analysis.action_verbs_count / 10) * 100)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(100, (data.experience_analysis.action_verbs_count / 10) * 100)}%"></div>
                        </div>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-info">
                            <span>Content Quality</span>
                            <span class="skill-percentage">${Math.min(100, (data.metrics.sentence_count / 50) * 100)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(100, (data.metrics.sentence_count / 50) * 100)}%"></div>
                        </div>
                    </div>
                </div>
            `;
            
            // Findings Section
            const findingsSection = document.createElement('div');
            findingsSection.className = 'findings-section';
            findingsSection.innerHTML = `
                <h3>Key Findings</h3>
                <div class="findings-grid">
                    ${createFinding('success', 'Technical Skills', data.skills_analysis.technical_skills > 5 ? 
                        'Strong skills presentation' : 'Consider adding more technical skills')}
                    ${createFinding('info', 'Experience', data.experience_analysis.action_verbs_count > 5 ? 
                        'Good use of action verbs' : 'Add more action verbs')}
                    ${createFinding('info', 'Organizations', 
                        `Referenced ${data.experience_analysis.organizations_mentioned} organizations`)}
                </div>
            `;
            
            // Improvement Suggestions Section
            const suggestionsSection = document.createElement('div');
            suggestionsSection.className = 'improvement-suggestions';
            suggestionsSection.innerHTML = `
                <h3>Improvement Suggestions</h3>
                <div class="suggestions-grid">
                    ${generateSuggestions(data)}
                </div>
            `;
            
            // Action Buttons Section
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';
            actionButtons.innerHTML = `
                <button class="btn btn-primary">Download Report</button>
                <button class="btn btn-secondary">Schedule Expert Review</button>
                <button class="btn btn-secondary analyze-another">Analyze Another Resume</button>
            `;
            
            // Add click handler for analyze another button
            const analyzeAnotherButton = actionButtons.querySelector('.analyze-another');
            if (analyzeAnotherButton) {
                analyzeAnotherButton.onclick = function() {
                    analysisResults.style.display = 'none';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
            }
            
            // Append all sections to results container
            resultsContainer.appendChild(scoreSection);
            resultsContainer.appendChild(skillsSection);
            resultsContainer.appendChild(findingsSection);
            resultsContainer.appendChild(suggestionsSection);
            resultsContainer.appendChild(actionButtons);
            
            // Append results container to analysis results
            analysisResults.appendChild(resultsContainer);
            
            // Scroll to results
            analysisResults.scrollIntoView({ behavior: 'smooth' });
            
            // Add styles for the new layout
            const style = document.createElement('style');
            style.textContent = `
                .results-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                }
                
                .results-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.97);
                    z-index: 0;
                }
                
                .results-container > * {
                    position: relative;
                    z-index: 1;
                }
                
                .score-section {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 2rem;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
                    border-radius: 12px;
                }
                
                .score-circle-container {
                    width: 150px;
                    height: 150px;
                    margin: 0 auto 1rem;
                    position: relative;
                    background: white;
                    border-radius: 50%;
                    padding: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .circular-chart {
                    width: 100%;
                    height: 100%;
                }
                
                .circle-bg {
                    fill: none;
                    stroke: #E5E7EB;
                    stroke-width: 3;
                }
                
                .circle {
                    fill: none;
                    stroke: #2563EB;
                    stroke-width: 3;
                    stroke-linecap: round;
                    transition: stroke-dashoffset 1s ease;
                }
                
                .score {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #2563EB;
                }
                
                .skills-analysis-section,
                .findings-section,
                .improvement-suggestions {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .skill-bars {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .skill-bar {
                    background: #F3F4F6;
                    border-radius: 8px;
                    padding: 1rem;
                }
                
                .skill-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }
                
                .progress-bar {
                    height: 8px;
                    background: #E5E7EB;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress {
                    height: 100%;
                    background: linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%);
                    border-radius: 4px;
                    transition: width 1s ease;
                }
                
                .findings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }
                
                .suggestions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                
                .action-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding: 2rem;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%);
                    border-radius: 12px;
                }
                
                .action-buttons button {
                    padding: 1rem 2rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .action-buttons button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                @media (max-width: 768px) {
                    .results-container {
                        padding: 1rem;
                        margin: 1rem;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                        padding: 1.5rem;
                    }
                    
                    .action-buttons button {
                        width: 100%;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
    }
    
    function createFinding(type, title, description) {
        return `
            <div class="finding-item ${type}">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
                <div class="finding-content">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
            </div>
        `;
    }
    
    function generateSuggestions(data) {
        return `
            <div class="suggestion-item high-priority">
                <i class="fas fa-star"></i>
                <div class="suggestion-content">
                    <h4>Professional Summary Impact</h4>
                    <span class="priority-tag">High Priority</span>
                    <p>Enhance your professional summary:</p>
                    <ul>
                        <li>Start with a powerful career statement</li>
                        <li>Highlight your years of experience and key achievements</li>
                        <li>Include your unique value proposition</li>
                        <li>Align with target industry keywords</li>
                    </ul>
                </div>
            </div>

            <div class="suggestion-item high-priority">
                <i class="fas fa-laptop-code"></i>
                <div class="suggestion-content">
                    <h4>Technical Skills Optimization</h4>
                    <span class="priority-tag">High Priority</span>
                    <p>Optimize your technical skills presentation:</p>
                    <ul>
                        <li>Group skills by category (e.g., Programming Languages, Frameworks, Tools)</li>
                        <li>List skills with proficiency levels</li>
                        <li>Highlight in-demand technologies first</li>
                        <li>Include relevant certifications and versions</li>
                    </ul>
                </div>
            </div>

            <div class="suggestion-item high-priority">
                <i class="fas fa-chart-line"></i>
                <div class="suggestion-content">
                    <h4>Quantifiable Achievements</h4>
                    <span class="priority-tag">High Priority</span>
                    <p>Add measurable impacts:</p>
                    <ul>
                        <li>Include metrics (%, $, time saved)</li>
                        <li>Specify project scope and team size</li>
                        <li>Highlight revenue or cost impacts</li>
                        <li>Show before/after comparisons</li>
                    </ul>
                </div>
            </div>

            <div class="suggestion-item medium-priority">
                <i class="fas fa-edit"></i>
                <div class="suggestion-content">
                    <h4>Experience Description Enhancement</h4>
                    <span class="priority-tag">Medium Priority</span>
                    <p>Strengthen your experience sections:</p>
                    <ul>
                        <li>Use powerful action verbs (Led, Developed, Implemented)</li>
                        <li>Focus on achievements over responsibilities</li>
                        <li>Include problem-solution-result format</li>
                        <li>Demonstrate leadership and initiative</li>
                    </ul>
                </div>
            </div>

            <div class="suggestion-item medium-priority">
                <i class="fas fa-bullseye"></i>
                <div class="suggestion-content">
                    <h4>ATS Optimization</h4>
                    <span class="priority-tag">Medium Priority</span>
                    <p>Optimize for Applicant Tracking Systems:</p>
                    <ul>
                        <li>Use industry-standard job titles</li>
                        <li>Include relevant keywords from job descriptions</li>
                        <li>Maintain clean formatting</li>
                        <li>Avoid tables and complex layouts</li>
                    </ul>
                </div>
            </div>

            <div class="suggestion-item medium-priority">
                <i class="fas fa-project-diagram"></i>
                <div class="suggestion-content">
                    <h4>Project Highlights</h4>
                    <span class="priority-tag">Medium Priority</span>
                    <p>Showcase key projects effectively:</p>
                    <ul>
                        <li>Include project name and objective</li>
                        <li>Highlight technologies used</li>
                        <li>Describe your specific role</li>
                        <li>Emphasize business impact</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Add CSS styles for the new suggestion items
    const style = document.createElement('style');
    style.textContent = `
        .improvement-suggestions {
            margin: 2rem 0;
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .improvement-suggestions h3 {
            margin-bottom: 1.5rem;
            color: #1a1a1a;
            font-size: 1.5rem;
        }

        .suggestions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .suggestion-item {
            display: flex;
            gap: 1.5rem;
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 12px;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }

        .suggestion-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .suggestion-item i {
            font-size: 1.5rem;
            color: #2563eb;
            margin-top: 0.25rem;
        }

        .suggestion-content {
            flex: 1;
        }

        .suggestion-content h4 {
            margin-bottom: 0.5rem;
            color: #1a1a1a;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .priority-tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
        }

        .high-priority .priority-tag {
            background: #fee2e2;
            color: #dc2626;
        }

        .medium-priority .priority-tag {
            background: #fef3c7;
            color: #d97706;
        }

        .suggestion-content p {
            margin-bottom: 0.75rem;
            color: #4b5563;
        }

        .suggestion-content ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .suggestion-content ul li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.5rem;
            color: #4b5563;
        }

        .suggestion-content ul li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: #2563eb;
        }

        @media (max-width: 768px) {
            .suggestions-grid {
                grid-template-columns: 1fr;
            }

            .suggestion-item {
                padding: 1rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Make resetUploadState available globally
    window.resetUploadState = resetUploadState;
}); 