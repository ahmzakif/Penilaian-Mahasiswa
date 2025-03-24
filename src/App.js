import React, { useState, useCallback } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState(
    Array(10).fill().map((_, i) => ({
      id: i + 1,
      name: `Mahasiswa ${i + 1}`,
      aspects: {
        aspek_penilaian_1: 1,
        aspek_penilaian_2: 1,
        aspek_penilaian_3: 1,
        aspek_penilaian_4: 1
      }
    }))
  );

  const [output, setOutput] = useState(null);

  const handleScoreChange = useCallback((studentId, aspect, value) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, aspects: { ...student.aspects, [aspect]: parseInt(value) || 1 } } 
          : student
      )
    );
  }, []);

  const addStudent = useCallback(() => {
    setStudents(prevStudents => [
      ...prevStudents,
      {
        id: prevStudents.length + 1,
        name: `Mahasiswa ${prevStudents.length + 1}`,
        aspects: {
          aspek_penilaian_1: 1,
          aspek_penilaian_2: 1,
          aspek_penilaian_3: 1,
          aspek_penilaian_4: 1
        }
      }
    ]);
  }, []);

  const removeStudent = useCallback(() => {
    if (students.length > 1) {
      setStudents(prevStudents => prevStudents.slice(0, -1));
    }
  }, [students.length]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const result = {};

    students.forEach(student => {
      for (const [aspect, score] of Object.entries(student.aspects)) {
        if (!result[aspect]) {
          result[aspect] = {};
        }
        result[aspect][`mahasiswa_${student.id}`] = score;
      }
    });

    setOutput(result);
  }, [students]);

  const downloadJSON = useCallback(() => {
    if (!output) return;
    
    const dataStr = JSON.stringify(output, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `penilaian-mahasiswa-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [output]);

  return (
    <div className="app">
      <h1>Aplikasi Penilaian Mahasiswa</h1>
      <div className="controls">
        <button 
          type="button" 
          onClick={removeStudent} 
          className="control-button minus"
          disabled={students.length <= 1}
        >
          -
        </button>
        <span className="student-count">{students.length} Mahasiswa</span>
        <button 
          type="button" 
          onClick={addStudent} 
          className="control-button plus"
        >
          +
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mahasiswa</th>
                {Object.keys(students[0].aspects).map(aspect => (
                  <th key={aspect}>{aspect.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  {Object.entries(student.aspects).map(([aspect, score]) => (
                    <td key={aspect}>
                      <select
                        value={score}
                        onChange={(e) => handleScoreChange(student.id, aspect, e.target.value)}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="action-buttons">
          <button type="submit" className="save-button">Simpan Penilaian</button>
          {output && (
            <button 
              type="button" 
              onClick={downloadJSON} 
              className="download-button"
            >
              Download JSON
            </button>
          )}
        </div>
      </form>
      
      {output && (
        <div className="output">
          <h2>Output JSON:</h2>
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;