import mongoose from 'mongoose';

const analyze = async () => {
  try {
    const uri =
      'mongodb+srv://meysterkiril_db_user:tY6vYqFiBu7sK4JU@main.ctozor8.mongodb.net/nodeJS-Restourant?retryWrites=true&w=majority';

    await mongoose.connect(uri);

    const collection = mongoose.connection.db.collection('orders');

    const explanation = await collection.find({ status: 'active' }).explain('executionStats');

    console.log('DB EXECUTION STATS');
    console.log('Total Docs Examined:', explanation.executionStats.totalDocsExamined);
    console.log('Total Docs Returned:', explanation.executionStats.nReturned);
    console.log('Execution Time (ms):', explanation.executionStats.executionTimeMillis);
    console.log('Stage:', explanation.executionStats.executionStages.stage);
  } catch (error) {
    console.error('Analysis Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

analyze();
