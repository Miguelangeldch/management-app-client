import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_CLIENT } from '../mutations/clientMutation';
import { GET_CLIENTS } from '../queries/clientQueries';

export default function AddClientModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [addClient] = useMutation(ADD_CLIENT, {
    variables: { name, email, phone },
    update(cache, { data: { addClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: [...clients, addClient] },
      });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || email === '' || phone === '') {
      return alert('All filds are REQUIRED');
    }

    addClient(name, email, phone);

    setEmail('');
    setName('');
    setPhone('');
  };

  return (
    <>
      <button
        type='button'
        className='btn btn-secondary'
        data-bs-toggle='modal'
        data-bs-target='#addClientModal'
      >
        <div className='d-flex align-items-center'>
          <FaUser className='icon' />
          <div>Add Client</div>
        </div>
      </button>

      <div
        className='modal fade'
        id='addClientModal'
        tabIndex='-1'
        aria-labelledby='addClientModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='addClientModalLabel'>
                Add Client
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
                    placeholder='Name Lastname'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Email</label>
                  <input
                    className='form-control'
                    id='email'
                    type={'email'}
                    placeholder='xxx@xxx.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Phone</label>
                  <input
                    className='form-control'
                    id='phone'
                    type={'tel'}
                    pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                    placeholder='xxx-xxx-xxxx'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <button
                  className='btn btn-secondary'
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
  );
}
