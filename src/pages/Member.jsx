import React, { useState, useMemo } from 'react';
import Navbar from '../components/core/Navbar';
import Footer from '../components/core/Footer';
import Table from '../components/member/Table';
import { useAllMembers } from '../hooks/member.hooks';
import { useAllCampuses } from '../hooks/campus.hooks';
import { useAllStudentClubs } from '../hooks/club.hooks';
import { useAllStudentChapters } from '../hooks/chapter.hooks';
import useDebounce from '../hooks/debouncer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { Dropdown } from '../components/ui/Dropdown';
import { TextField } from '../components/ui/Textfield';
import { TableSkeleton } from '../components/ui/SkeletonLoad';
import NotFoundCard from '../components/ui/NotFoundCard';
import ErrorCard from '../components/ui/ErrorCard';

const Member = () => {
  const [filtersState, setFiltersState] = useState({
    search: '',
    campus: '',
    club: '',
    chapter: '',
    sort: '',
    page: 1,
  });

  const debouncedSearch = useDebounce(filtersState.search, 500);
  const limit = 10;

  const filters = useMemo(() => {
    const f = { page: filtersState.page, limit };
    if (debouncedSearch) f.query = debouncedSearch;
    if (filtersState.campus) f.campus_id = filtersState.campus;
    if (filtersState.club) f.student_club_id = filtersState.club;
    if (filtersState.chapter) f.student_chapter_id = filtersState.chapter;
    return f;
  }, [debouncedSearch, filtersState, limit]);

  const { members, isLoading: memberIsLoading, error: memberError, refetch } = useAllMembers(filters);
  const { campuses, isLoading: campusIsLoading, error: campusError } = useAllCampuses();
  const { clubs, isLoading: clubIsLoading, error: clubError } = useAllStudentClubs();
  const { chapters, isLoading: chapterIsLoading, error: chapterError } = useAllStudentChapters();
  
  const campusOptions = useMemo(() => campuses?.map(c => ({ value: c.id, label: c.institute })) || [], [campuses]);
  const clubOptions = useMemo(() => clubs?.map(c => ({ value: c.id, label: c.name })) || [], [clubs]);
  const chapterOptions = useMemo(() => chapters?.map(c => ({ value: c.id, label: c.institute })) || [], [chapters]);
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'unique_number', label: 'Unique Number' },
  ];

  const handleTextChange = (key) => (e) => {
    setFiltersState(prev => ({ ...prev, [key]: e.target.value, page: 1 }));
  };
  
  const handleDropdownChange = (key) => (value) => {
    setFiltersState(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const sortedMembers = useMemo(() => {
    if (!members) return [];
    let sorted = [...members];
    if (filtersState.sort) {
      sorted.sort((a, b) => {
        if (filtersState.sort === 'name') return a.name.localeCompare(b.name);
        if (filtersState.sort === 'unique_number') return a.unique_number.localeCompare(b.unique_number);
        return 0;
      });
    }
    return sorted;
  }, [members, filtersState.sort]);

  return (
    <>
      <Navbar textColor="text-dark" buttonColor="secondary" barsColor='text-gray-700' applyImageFilter={false} />

      <div className="container mx-auto px-4 pt-20">
        <h1 className="text-4xl font-bold text-center text-dark">Our Members</h1>
        <p className="text-lg text-center text-gray-700">
          Details about our esteemed members will be displayed here soon.
        </p>
      </div>

      <div className="container mx-auto max-w-[80vw] px-4 py-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 px-[25%]">
          <div className="w-full md:w-2/3">
            <TextField
              type="text"
              value={filtersState.search}
              onChange={handleTextChange('search')}
              placeholder="Search members by name"
              endAdornment={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
            />
          </div>
          <div className="w-full md:w-1/3">
            <Dropdown
              options={sortOptions}
              value={filtersState.sort}
              onValueChange={handleDropdownChange('sort')}
              placeholder="Sort By"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:flex-1">
            <Dropdown
              label="Campuses"
              options={campusOptions}
              value={filtersState.campus}
              onValueChange={handleDropdownChange('campus')}
              disabled={campusIsLoading}
              error={campusError ? 'Gagal memuat' : null}
              placeholder={campusIsLoading ? 'Memuat...' : 'All Campuses'}
            />
          </div>
          <div className="w-full md:flex-1">
            <Dropdown
              label="Clubs"
              options={clubOptions}
              value={filtersState.club}
              onValueChange={handleDropdownChange('club')}
              disabled={clubIsLoading}
              error={clubError ? 'Gagal memuat' : null}
              placeholder={clubIsLoading ? 'Memuat...' : 'All Clubs'}
            />
          </div>
          <div className="w-full md:flex-1">
            <Dropdown
              label="Chapters"
              options={chapterOptions}
              value={filtersState.chapter}
              onValueChange={handleDropdownChange('chapter')}
              disabled={chapterIsLoading}
              error={chapterError ? 'Gagal memuat' : null}
              placeholder={chapterIsLoading ? 'Memuat...' : 'All Chapters'}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {memberIsLoading ? (
          <TableSkeleton />
        ) : memberError ? (
          <ErrorCard message="Error loading members" onRetry={() => refetch()} />
        ) : (members?.length ?? 0) === 0 ? (
          <NotFoundCard message="No members found" />
        ) : (
          <>
            <Table
              members={sortedMembers.map((member) => ({
                unique_number: member.unique_number,
                name: member.name,
                club: member.student_club?.name || 'Unknown',
                chapter: member.student_chapter?.name || 'Unknown',
                campus: member.student_campus?.institute || 'Unknown',
                is_active: member.is_active
              }))}
            />
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Member;
