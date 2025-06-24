import React from 'react';
import Layout from '../components/Layout/Layout';
import FolderView from '../components/Folder/FolderView';

const FolderPage = () => {
  return (
    <Layout showFooter={false}>
      <FolderView />
    </Layout>
  );
};

export default FolderPage;