import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "../../redux/slices/catalogSlice";
import CatalogCard from "../../components/CatalogCard";

const CatalogPage = () => {
  const dispatch = useDispatch();
  const { contests, loading, error } = useSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  useEffect(() => {
    document.title = "All Contests | RCE System";
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6" tabIndex={0}>
        All Contests
      </h1>

      {loading && <p className="text-center text-gray-500" role="status">Loading contests...</p>}
      {error && <p className="text-center text-red-500" role="alert">{error}</p>}

      {!loading && !error && contests?.length === 0 && (
        <p className="text-center text-gray-500">No contests available at the moment.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {contests?.map((contest) => (
          <CatalogCard key={contest._id} contest={contest} />
        ))}
      </div>
    </main>
  );
};

export default CatalogPage;