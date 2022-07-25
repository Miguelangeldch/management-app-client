import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_PROJECT } from '../queries/projectQueries';
import { UPDATE_PROJECT } from '../mutations/projectMutation';

export default function EditProjectForm({ project }) {
  const currentStatus = (status) => {
    let currentStatus = '';
    switch (status) {
      case 'No Started':
        currentStatus = 'new';
        break;
      case 'In Progress':
        currentStatus = 'progress';
        break;
      case 'Completed':
        currentStatus = 'completed';
        break;
      default:
    }
    return currentStatus;
  };

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(currentStatus(project.status));

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: { id: project.id, name, description, status },
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !status) {
      return alert('Please fill out all fields');
    }

    updateProject(name, description, status);
  };

  return (
    <div className='mt-5'>
      <h3>Update Project Details</h3>
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

        <button className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
}
