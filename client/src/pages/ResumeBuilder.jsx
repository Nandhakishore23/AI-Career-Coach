import React, { useState, useRef } from 'react';
import { FileText, Plus, Trash2, Sparkles, Download, Eye, Edit3, Loader } from 'lucide-react';
import api from '../utils/api';

const ResumeBuilder = () => {
    const [view, setView] = useState('edit'); // edit | preview
    const [enhancing, setEnhancing] = useState(null); // field being enhanced
    const printRef = useRef(null);

    const [resume, setResume] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
            portfolio: '',
            summary: ''
        },
        experience: [
            { company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }
        ],
        education: [
            { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
        ],
        skills: [''],
        projects: [
            { name: '', description: '', tech: '', link: '' }
        ],
        certifications: ['']
    });

    // Update helpers
    const updatePersonal = (field, value) => {
        setResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    };

    const updateExperience = (index, field, value) => {
        setResume(prev => {
            const exp = [...prev.experience];
            exp[index] = { ...exp[index], [field]: value };
            return { ...prev, experience: exp };
        });
    };

    const updateExpBullet = (expIdx, bulletIdx, value) => {
        setResume(prev => {
            const exp = [...prev.experience];
            const bullets = [...exp[expIdx].bullets];
            bullets[bulletIdx] = value;
            exp[expIdx] = { ...exp[expIdx], bullets };
            return { ...prev, experience: exp };
        });
    };

    const addExpBullet = (expIdx) => {
        setResume(prev => {
            const exp = [...prev.experience];
            exp[expIdx] = { ...exp[expIdx], bullets: [...exp[expIdx].bullets, ''] };
            return { ...prev, experience: exp };
        });
    };

    const removeExpBullet = (expIdx, bulletIdx) => {
        setResume(prev => {
            const exp = [...prev.experience];
            exp[expIdx] = { ...exp[expIdx], bullets: exp[expIdx].bullets.filter((_, i) => i !== bulletIdx) };
            return { ...prev, experience: exp };
        });
    };

    const addExperience = () => {
        setResume(prev => ({
            ...prev,
            experience: [...prev.experience, { company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }]
        }));
    };

    const removeExperience = (idx) => {
        setResume(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
    };

    const updateEducation = (index, field, value) => {
        setResume(prev => {
            const edu = [...prev.education];
            edu[index] = { ...edu[index], [field]: value };
            return { ...prev, education: edu };
        });
    };

    const addEducation = () => {
        setResume(prev => ({
            ...prev,
            education: [...prev.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]
        }));
    };

    const removeEducation = (idx) => {
        setResume(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
    };

    const updateSkill = (index, value) => {
        setResume(prev => {
            const skills = [...prev.skills];
            skills[index] = value;
            return { ...prev, skills };
        });
    };

    const addSkill = () => setResume(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    const removeSkill = (idx) => setResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));

    const updateProject = (index, field, value) => {
        setResume(prev => {
            const projects = [...prev.projects];
            projects[index] = { ...projects[index], [field]: value };
            return { ...prev, projects };
        });
    };

    const addProject = () => {
        setResume(prev => ({
            ...prev,
            projects: [...prev.projects, { name: '', description: '', tech: '', link: '' }]
        }));
    };

    const removeProject = (idx) => {
        setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
    };

    const updateCert = (index, value) => {
        setResume(prev => {
            const certs = [...prev.certifications];
            certs[index] = value;
            return { ...prev, certifications: certs };
        });
    };

    const addCert = () => setResume(prev => ({ ...prev, certifications: [...prev.certifications, ''] }));
    const removeCert = (idx) => setResume(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }));

    // AI Enhancement
    const enhanceWithAI = async (field, text) => {
        if (!text || text.trim().length < 5) return;
        setEnhancing(field);
        try {
            const res = await api.post('/roadmap/topic-content', {
                topic: `Enhance this resume ${field} to be more impactful and professional. Keep it concise. Original: "${text}"`,
                role: resume.personalInfo.summary || 'Software Engineer'
            });
            // Try to extract enhanced text from AI response
            if (res.data?.content) {
                // Simple extraction — look for the enhanced text
                const enhanced = typeof res.data.content === 'string'
                    ? res.data.content.substring(0, 500)
                    : text;
                return enhanced;
            }
        } catch (err) {
            console.log('AI enhance failed:', err.message);
        } finally {
            setEnhancing(null);
        }
        return text;
    };

    const enhanceSummary = async () => {
        const result = await enhanceWithAI('summary', resume.personalInfo.summary);
        if (result) updatePersonal('summary', result);
    };

    const enhanceBullet = async (expIdx, bulletIdx) => {
        const bullet = resume.experience[expIdx].bullets[bulletIdx];
        const result = await enhanceWithAI('bullet point', bullet);
        if (result) updateExpBullet(expIdx, bulletIdx, result);
    };

    // PDF Download (Print-based approach)
    const downloadPDF = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${resume.personalInfo.fullName || 'Resume'}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: 'Arial', sans-serif; color: #1a1a1a; padding: 40px 50px; line-height: 1.5; }
                        h1 { font-size: 24px; text-align: center; margin-bottom: 4px; }
                        .contact { text-align: center; font-size: 11px; color: #555; margin-bottom: 16px; }
                        .contact a { color: #0066cc; text-decoration: none; }
                        h2 { font-size: 14px; text-transform: uppercase; border-bottom: 1.5px solid #333; padding-bottom: 3px; margin: 14px 0 8px; letter-spacing: 1px; }
                        .summary { font-size: 12px; color: #444; margin-bottom: 8px; }
                        .entry { margin-bottom: 10px; }
                        .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
                        .entry-header strong { font-size: 13px; }
                        .entry-header em { font-size: 11px; color: #666; font-style: normal; }
                        .entry-sub { font-size: 12px; color: #555; }
                        ul { padding-left: 16px; margin: 4px 0; }
                        li { font-size: 12px; margin-bottom: 2px; color: #333; }
                        .skills { font-size: 12px; color: #333; }
                        .project-name { font-weight: bold; font-size: 12px; }
                        .project-desc { font-size: 11px; color: #555; }
                        .project-tech { font-size: 10px; color: #777; font-style: italic; }
                        @media print { body { padding: 30px 40px; } }
                    </style>
                </head>
                <body>${printContent.innerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => { printWindow.print(); }, 500);
    };

    const inputClass = "w-full bg-black/30 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all placeholder-gray-600";
    const labelClass = "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block";
    const sectionClass = "bg-[#111] rounded-xl border border-gray-800 p-5 space-y-4";

    const renderEditor = () => (
        <div className="space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-16">
            {/* Personal Info */}
            <div className={sectionClass}>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">👤 Personal Information</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>Full Name</label><input className={inputClass} value={resume.personalInfo.fullName} onChange={e => updatePersonal('fullName', e.target.value)} placeholder="John Doe" /></div>
                    <div><label className={labelClass}>Email</label><input className={inputClass} value={resume.personalInfo.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="john@example.com" /></div>
                    <div><label className={labelClass}>Phone</label><input className={inputClass} value={resume.personalInfo.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+1 234 567 890" /></div>
                    <div><label className={labelClass}>Location</label><input className={inputClass} value={resume.personalInfo.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="New York, NY" /></div>
                    <div><label className={labelClass}>LinkedIn</label><input className={inputClass} value={resume.personalInfo.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" /></div>
                    <div><label className={labelClass}>GitHub</label><input className={inputClass} value={resume.personalInfo.github} onChange={e => updatePersonal('github', e.target.value)} placeholder="github.com/johndoe" /></div>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <label className={labelClass}>Professional Summary</label>
                        <button onClick={enhanceSummary} disabled={enhancing === 'summary'}
                            className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium">
                            {enhancing === 'summary' ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            Enhance with AI
                        </button>
                    </div>
                    <textarea className={`${inputClass} min-h-[80px]`} value={resume.personalInfo.summary}
                        onChange={e => updatePersonal('summary', e.target.value)}
                        placeholder="Brief professional summary highlighting your key skills and career goals..." />
                </div>
            </div>

            {/* Experience */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">💼 Experience</h3>
                    <button onClick={addExperience} className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium">
                        <Plus className="w-3 h-3" /> Add
                    </button>
                </div>
                {resume.experience.map((exp, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-4 space-y-3 border border-gray-800/50 relative">
                        {resume.experience.length > 1 && (
                            <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-gray-600 hover:text-rose-400">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={labelClass}>Company</label><input className={inputClass} value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Google" /></div>
                            <div><label className={labelClass}>Role</label><input className={inputClass} value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} placeholder="Software Engineer" /></div>
                            <div><label className={labelClass}>Start Date</label><input className={inputClass} value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} placeholder="Jan 2023" /></div>
                            <div><label className={labelClass}>End Date</label><input className={inputClass} value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} placeholder="Present" /></div>
                        </div>
                        <div>
                            <label className={labelClass}>Key Achievements</label>
                            {exp.bullets.map((bullet, bi) => (
                                <div key={bi} className="flex items-center gap-2 mb-2">
                                    <span className="text-gray-600 text-xs">•</span>
                                    <input className={`${inputClass} flex-1`} value={bullet}
                                        onChange={e => updateExpBullet(i, bi, e.target.value)}
                                        placeholder="Describe your achievement with numbers..." />
                                    <button onClick={() => enhanceBullet(i, bi)} disabled={enhancing !== null}
                                        className="text-primary-400 hover:text-primary-300 shrink-0 p-1">
                                        {enhancing === 'bullet point' ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    </button>
                                    {exp.bullets.length > 1 && (
                                        <button onClick={() => removeExpBullet(i, bi)} className="text-gray-600 hover:text-rose-400 shrink-0 p-1">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button onClick={() => addExpBullet(i)} className="text-[10px] text-gray-500 hover:text-gray-400 mt-1">+ Add bullet point</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Education */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">🎓 Education</h3>
                    <button onClick={addEducation} className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium">
                        <Plus className="w-3 h-3" /> Add
                    </button>
                </div>
                {resume.education.map((edu, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-4 border border-gray-800/50 relative">
                        {resume.education.length > 1 && (
                            <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-gray-600 hover:text-rose-400">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={labelClass}>Institution</label><input className={inputClass} value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="MIT" /></div>
                            <div><label className={labelClass}>Degree</label><input className={inputClass} value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="B.Tech" /></div>
                            <div><label className={labelClass}>Field of Study</label><input className={inputClass} value={edu.field} onChange={e => updateEducation(i, 'field', e.target.value)} placeholder="Computer Science" /></div>
                            <div><label className={labelClass}>GPA</label><input className={inputClass} value={edu.gpa} onChange={e => updateEducation(i, 'gpa', e.target.value)} placeholder="3.8/4.0" /></div>
                            <div><label className={labelClass}>Start</label><input className={inputClass} value={edu.startDate} onChange={e => updateEducation(i, 'startDate', e.target.value)} placeholder="2019" /></div>
                            <div><label className={labelClass}>End</label><input className={inputClass} value={edu.endDate} onChange={e => updateEducation(i, 'endDate', e.target.value)} placeholder="2023" /></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">⚡ Skills</h3>
                    <button onClick={addSkill} className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium">
                        <Plus className="w-3 h-3" /> Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-1 bg-black/30 border border-gray-800 rounded-lg px-2 py-1">
                            <input className="bg-transparent text-sm text-gray-200 w-24 outline-none" value={skill}
                                onChange={e => updateSkill(i, e.target.value)} placeholder="React" />
                            {resume.skills.length > 1 && (
                                <button onClick={() => removeSkill(i)} className="text-gray-600 hover:text-rose-400">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Projects */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">🚀 Projects</h3>
                    <button onClick={addProject} className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium">
                        <Plus className="w-3 h-3" /> Add
                    </button>
                </div>
                {resume.projects.map((proj, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-4 border border-gray-800/50 relative">
                        {resume.projects.length > 1 && (
                            <button onClick={() => removeProject(i)} className="absolute top-2 right-2 text-gray-600 hover:text-rose-400">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={labelClass}>Project Name</label><input className={inputClass} value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} placeholder="AI Career Coach" /></div>
                            <div><label className={labelClass}>Technologies</label><input className={inputClass} value={proj.tech} onChange={e => updateProject(i, 'tech', e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
                        </div>
                        <div className="mt-3">
                            <label className={labelClass}>Description</label>
                            <textarea className={`${inputClass} min-h-[60px]`} value={proj.description}
                                onChange={e => updateProject(i, 'description', e.target.value)}
                                placeholder="Brief description of the project and your contributions..." />
                        </div>
                    </div>
                ))}
            </div>

            {/* Certifications */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">🏅 Certifications</h3>
                    <button onClick={addCert} className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium">
                        <Plus className="w-3 h-3" /> Add
                    </button>
                </div>
                {resume.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <input className={`${inputClass} flex-1`} value={cert}
                            onChange={e => updateCert(i, e.target.value)}
                            placeholder="AWS Certified Developer - Associate" />
                        {resume.certifications.length > 1 && (
                            <button onClick={() => removeCert(i)} className="text-gray-600 hover:text-rose-400 p-1">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const p = resume.personalInfo;
    const hasContent = p.fullName || resume.experience.some(e => e.company) || resume.education.some(e => e.institution);

    const renderPreview = () => (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div ref={printRef} className="bg-white text-black p-8 max-w-[700px] mx-auto rounded-lg shadow-2xl" style={{ fontFamily: "'Arial', sans-serif", lineHeight: '1.5' }}>
                {/* Name & Contact */}
                <h1 style={{ fontSize: '24px', textAlign: 'center', fontWeight: 'bold', marginBottom: '4px' }}>
                    {p.fullName || 'Your Name'}
                </h1>
                <div style={{ textAlign: 'center', fontSize: '11px', color: '#555', marginBottom: '14px' }}>
                    {[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(' • ')}
                </div>

                {/* Summary */}
                {p.summary && (
                    <>
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #333', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px', fontWeight: 'bold' }}>Summary</h2>
                        <p style={{ fontSize: '12px', color: '#444', marginBottom: '12px' }}>{p.summary}</p>
                    </>
                )}

                {/* Experience */}
                {resume.experience.some(e => e.company) && (
                    <>
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #333', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px', fontWeight: 'bold' }}>Experience</h2>
                        {resume.experience.filter(e => e.company).map((exp, i) => (
                            <div key={i} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <strong style={{ fontSize: '13px' }}>{exp.role}{exp.company ? ` — ${exp.company}` : ''}</strong>
                                    <em style={{ fontSize: '11px', color: '#666', fontStyle: 'normal' }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</em>
                                </div>
                                <ul style={{ paddingLeft: '16px', margin: '4px 0' }}>
                                    {exp.bullets.filter(b => b.trim()).map((b, bi) => (
                                        <li key={bi} style={{ fontSize: '12px', marginBottom: '2px', color: '#333' }}>{b}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </>
                )}

                {/* Education */}
                {resume.education.some(e => e.institution) && (
                    <>
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #333', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px', fontWeight: 'bold' }}>Education</h2>
                        {resume.education.filter(e => e.institution).map((edu, i) => (
                            <div key={i} style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <strong style={{ fontSize: '13px' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''} — {edu.institution}</strong>
                                    <em style={{ fontSize: '11px', color: '#666', fontStyle: 'normal' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</em>
                                </div>
                                {edu.gpa && <div style={{ fontSize: '11px', color: '#555' }}>GPA: {edu.gpa}</div>}
                            </div>
                        ))}
                    </>
                )}

                {/* Skills */}
                {resume.skills.some(s => s.trim()) && (
                    <>
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #333', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px', fontWeight: 'bold' }}>Skills</h2>
                        <p style={{ fontSize: '12px', color: '#333' }}>{resume.skills.filter(s => s.trim()).join(' • ')}</p>
                    </>
                )}

                {/* Projects */}
                {resume.projects.some(p => p.name) && (
                    <>
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #333', paddingBottom: '3px', marginBottom: '6px', marginTop: '12px', letterSpacing: '1px', fontWeight: 'bold' }}>Projects</h2>
                        {resume.projects.filter(p => p.name).map((proj, i) => (
                            <div key={i} style={{ marginBottom: '8px' }}>
                                <strong style={{ fontSize: '12px' }}>{proj.name}</strong>
                                {proj.tech && <span style={{ fontSize: '10px', color: '#777', fontStyle: 'italic' }}> ({proj.tech})</span>}
                                {proj.description && <p style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{proj.description}</p>}
                            </div>
                        ))}
                    </>
                )}

                {/* Certifications */}
                {resume.certifications.some(c => c.trim()) && (
                    <>
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #333', paddingBottom: '3px', marginBottom: '6px', marginTop: '12px', letterSpacing: '1px', fontWeight: 'bold' }}>Certifications</h2>
                        <ul style={{ paddingLeft: '16px' }}>
                            {resume.certifications.filter(c => c.trim()).map((c, i) => (
                                <li key={i} style={{ fontSize: '12px', color: '#333', marginBottom: '2px' }}>{c}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#111] border border-gray-800 rounded-xl p-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Resume Builder</h1>
                        <p className="text-xs text-gray-500">Build, enhance with AI, and download your resume</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-black/40 rounded-lg border border-gray-800 p-0.5">
                        <button onClick={() => setView('edit')}
                            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'edit' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            <Edit3 className="w-3 h-3 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => setView('preview')}
                            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            <Eye className="w-3 h-3 inline mr-1" /> Preview
                        </button>
                    </div>
                    <button onClick={downloadPDF} disabled={!hasContent}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${hasContent
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg active:scale-95'
                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            }`}>
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                {view === 'edit' ? renderEditor() : renderPreview()}
            </div>
        </div>
    );
};

export default ResumeBuilder;
