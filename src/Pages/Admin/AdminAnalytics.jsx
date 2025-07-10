import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnalyticsSummary, fetchAllJrms } from '../../operations/adminApi';
import { unFetchedLeads } from '../../operations/rmApi';
import Select from 'react-select';

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.users);
  const { analytics, loading, error } = useSelector((state) => state.analytics);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [unFetched, setUnFetch] = useState(0);

  // Fetch JRMs
  useEffect(() => {
    dispatch(fetchAllJrms());
  }, [dispatch]);

  // Fetch Analytics Summary
  useEffect(() => {
    dispatch(AnalyticsSummary(startDate, endDate, selectedUserId));
  }, [startDate, endDate, selectedUserId, dispatch]);

  // Fetch Unfetched Leads Count
  useEffect(() => {
    const fetchUnassignedLead = async () => {
      try {
        const data = await dispatch(unFetchedLeads());
        setUnFetch(data);
      } catch (err) {
        console.error("Failed to fetch unfetched leads");
      }
    };

    fetchUnassignedLead();
  }, [dispatch]);

  // Map users for react-select
  const jrmOptions = allUsers?.map((user) => ({
    value: user.id,
    label: user.name,
  })) || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-10">
      <h2 className="text-2xl font-bold mb-6 text-richblack-700">📊 Analytics Summary</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="min-w-[250px]">
          <Select
            options={[{ value: '', label: 'All JRMs' }, ...jrmOptions]}
            value={jrmOptions.find((opt) => opt.value === selectedUserId) || { value: '', label: 'All JRMs' }}
            onChange={(selectedOption) => setSelectedUserId(selectedOption.value)}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable
          />
        </div>
      </div>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-pink-500">{error}</p>}

      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded shadow-md">
          <SummaryCard title="Unfetch Leads" value={unFetched} />
          <SummaryCard title="Fetched Leads" value={analytics.fetchedLeads} />
          <SummaryCard title="Referred Leads" value={analytics.referredLeads} />
          <SummaryCard title="Under US Approved" value={analytics.underUs} />
          <SummaryCard title="Code Approved" value={analytics.codeApproved} />
          <SummaryCard title="AOMA Activated" value={analytics.aomaActivated} />
          <SummaryCard title="Activation Done" value={analytics.activationDone} />
          <SummaryCard title="MS Teams Login" value={analytics.msTeamsLogin} />
          <SummaryCard title="SIP Setup" value={analytics.sipSetup} />
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-richblack-100 p-4 rounded shadow">
    <h3 className="font-semibold text-richblack-700">{title}</h3>
    <p className="text-richblack-900 text-lg font-bold">{value || 0}</p>
  </div>
);

export default AdminAnalytics;
