import { Link, useParams } from 'react-router-dom';
import { GET_PROJECT } from '../queries/projectQueries';
import Spinner from '../components/Spinner';
import { useQuery } from '@apollo/client';
import ClientInfo from '../components/ClientInfo';
import DeleteProjectButton from '../components/DeleteProjectButton';
import EditProjectForm from '../components/EditProjectForm';

export default function Project() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
        {!loading && !error && (
            <div className='mx-auto w-75 card p-5' >
                <Link to={'/'} className='btn btn-light btn-sm w-15 d-inline ms-auto' >Home</Link>
                <h1>{data.project.name}</h1>
                <p>{data.project.description}</p>
                <h5>Project Status</h5>
                <p className='lead'>{data.project.status}</p>
                <ClientInfo client={data.project.client}/>
                <EditProjectForm project={data.project}/>
                <DeleteProjectButton projectId={data.project.id}/>
            </div>
        )}
    </>
  );
}
