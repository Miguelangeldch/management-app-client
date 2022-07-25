import { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../queries/projectQueries';
import { GET_CLIENTS } from '../queries/clientQueries';
import { ADD_PROJECT } from '../mutations/projectMutation';

export default function AddProjectModal() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState('new');
  
  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, clientId, status },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({ query: GET_PROJECTS });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] },
      });
    },
  });

  // Get clients for select
  const { loading, error, data } = useQuery(GET_CLIENTS);


  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || description === '' || status === '') {
      return alert('All filds are REQUIRED');
    }

    addProject(name, description, clientId, status);

    setDescription('');
    setName('');
    setClientId('');
    setStatus('new');
  };

  if (loading) return null;
  if (error) return `Error`;

  return (
    <>
      {!loading && !error && (
        <>
          <button
            type='button'
            className='btn btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#addProjectModal'
          >
            <div className='d-flex align-items-center'>
              <FaList className='icon' />
              <div>New Project</div>
            </div>
          </button>

          <div
            className='modal fade'
            id='addProjectModal'
            tabIndex='-1'
            aria-labelledby='addProjectModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='addProjectModalLabel'>
                    Add Project
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <form onSubmit={onSubmit}>
                    <div className='mb-3'>
                      <label className='form-label'>Name</label>
                      <input
                        className='form-control'
                        id='name'
                        type={'text'}
                        placeholder='Project name...'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Description</label>
                      <textarea
                        className='form-control'
                        id='description'
                        placeholder='Project description...'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Status</label>
                      <select
                        id='status'
                        className='form-select'
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value={'new'}>Not Started</option>
                        <option value={'progress'}>In Progress</option>
                        <option value={'completed'}>Completed</option>
                      </select>
                    </div>
                    <div className='mb-3'>
                  <label className='form-label'>Client</label>
                  <select
                        id='clientId'
                        className='form-select'
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                      >
                      <option value=''>Select Client</option>
                      {
                        data.clients.map(client => {return(
                          <option key={client.id} value={client.id}>{client.name}</option>
                        )})
                      }
                      </select>

                </div>
                    <button
                      className='btn btn-primary'
                      type='submit'
                      data-bs-dismiss='modal'
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
