import React, { useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import '../../assets/styles/index.css';
import { TextField } from '../ui/Textfield';
import { Dropdown } from '../ui/Dropdown';
import { RadioGroup } from '../ui/RadioButton';

import {
  useUpdateUserProfile,
  useAllProgramAlumni,
  useAllDomiciles
} from '../../hooks/member.hooks';
import { useAllCampuses } from '../../hooks/campus.hooks';
import { useAllStudentChapters } from '../../hooks/chapter.hooks';
import { useAllMajors } from '../../hooks/major.hooks';

const formatOptions = (data, labelKey = 'name', valueKey = 'id', includeOther = false) => {
  if (!data) return [];

  const options = [...data.map((item) => ({ label: item[labelKey], value: item[valueKey] }))];

  if (includeOther) {
    options.push({ label: 'Other', value: 'other' });
  }

  return options;
};

const genderOptions = [
  { label: 'Man', value: 'L' },
  { label: 'Woman', value: 'P' }
];

const statusOptions = [
  { label: 'Mahasiswa/Siswi', value: 'mahasiswa/siswi' },
  { label: 'Bekerja', value: 'bekerja' },
  { label: 'Fresh Graduate', value: 'fresh graduate' }
];

const UpdateBioModal = ({ isOpen, onClose, user, onSuccess }) => {
  const { executeUpdateProfile, isLoading: isUpdating } = useUpdateUserProfile();

  const { campuses, isLoading: campusLoading } = useAllCampuses();
  const { majors, isLoading: majorLoading } = useAllMajors();
  const { chapters, isLoading: chapterLoading } = useAllStudentChapters();
  const { programAlumni, isLoading: alumniLoading } = useAllProgramAlumni();
  const { domiciles, isLoading: domicileLoading } = useAllDomiciles();

  const campusOptions = formatOptions(campuses, 'institute', 'id');
  const majorOptions = formatOptions(majors, 'major', 'id');
  const chapterOptions = formatOptions(chapters, 'institute', 'id');
  const alumniOptions = formatOptions(programAlumni, 'name', 'id');
  const domicileOptions = formatOptions(domiciles, 'domisili', 'id');

  const { register, handleSubmit, reset, control, watch } = useForm({
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
      birthday: user?.birthday || '',
      status: user?.status || '',
      institute: user?.student_campus?.id || '',
      major: user?.major_campus?.id || '',
      program_alumni: user?.program_alumni?.id || '',
      domisili: user?.domisili?.id || '',
      student_chapter: user?.student_chapter?.id || '',
      institute_other: user?.student_campus_name || '',
      major_other: user?.major_campus_name || '',
      domisili_other: user?.domisili_name || ''
    }
  });

  const watchedInstitute = watch('institute');
  const watchedMajor = watch('major');
  const watchedDomicile = watch('domisili');

  useEffect(() => {
    if (user) {
      reset({
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        birthday: user?.birthday || '',
        status: user?.status || '',
        institute: user?.student_campus?.id || '',
        major: user?.major_campus?.id || '',
        program_alumni: user?.program_alumni?.id || '',
        domisili: user?.domisili?.id || '',
        student_chapter: user?.student_chapter?.id || '',
        institute_other: user?.student_campus_name || '',
        major_other: user?.major_campus_name || '',
        domisili_other: user?.domisili_name || ''
      });
    }
  }, [user, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('gender', data.gender);
      formData.append('birthday', data.birthday);
      formData.append('status', data.status);
      formData.append('student_campus_id', data.institute);
      // if (data.institute === 'other') {
      //   formData.delete('student_campus_id');
      //   formData.append('student_campus_name', data.institute_other);
      // }
      formData.append('major_campus_id', data.major);
      // if (data.major === 'other') {
      //   formData.delete('major_campus_id');
      //   formData.append('major_campus_name', data.major_other);
      // }
      formData.append('program_alumni_id', data.program_alumni);
      // formData.append('domisili_id', data.domisili);
      // if (data.domisili === 'other') {
      //   formData.delete('domisili_id');
      //   formData.append('domisili_name', data.domisili_other);
      // }
      if (data.student_chapter !== '') {
        formData.append('student_chapter_id', data.student_chapter);
      }

      await executeUpdateProfile(formData);

      toast.success('Bio updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update bio. ' + (error.data?.message || 'Please try again.'));
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full scrollbar-hide max-w-md transform overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Update Bio</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email..."
                    {...register('email')}
                    disabled={true}
                    // required
                  />
                  <TextField
                    id="phone"
                    label="Phone"
                    type="tel"
                    placeholder="Enter your phone number..."
                    {...register('phone')}
                    disabled={isUpdating}
                    required
                  />
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        title="Gender *"
                        options={genderOptions}
                        value={field.value}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        disabled={isUpdating}
                      />
                    )}
                  />
                  <TextField
                    id="birthday"
                    label="Birth Date"
                    type="date"
                    placeholder="Enter your birth date..."
                    {...register('birthday')}
                    disabled={isUpdating}
                    required
                  />
                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        ref={field.ref}
                        label="Status"
                        options={statusOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Status"
                        disabled={isUpdating}
                        error={error?.message}
                        required
                      />
                    )}
                  />
                  <Controller
                    name="institute"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        ref={field.ref}
                        label="Institute / Campus *"
                        options={campusOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Institute / Campus"
                        disabled={campusLoading || isUpdating}
                        error={error?.message}
                      />
                    )}
                  />
                  {watchedInstitute === 'other' && (
                    <TextField
                      id="institute_other"
                      label="Campus Name *"
                      placeholder="Enter your campus name"
                      {...register('institute_other')}
                      disabled={isUpdating}
                      required
                    />
                  )}
                  <Controller
                    name="major"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        ref={field.ref}
                        label="Major *"
                        options={majorOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Major"
                        disabled={majorLoading || isUpdating}
                        error={error?.message}
                      />
                    )}
                  />
                  {watchedMajor === 'other' && (
                    <TextField
                      id="major_other"
                      label="Major Name *"
                      placeholder="Enter your major name"
                      {...register('major_other')}
                      disabled={isUpdating}
                      required
                    />
                  )}
                  <Controller
                    name="program_alumni"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        ref={field.ref}
                        label="Program Alumni *"
                        options={alumniOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Program Alumni"
                        disabled={alumniLoading || isUpdating}
                        error={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="student_chapter"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        ref={field.ref}
                        label="Chapter"
                        options={chapterOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Chapter"
                        disabled={chapterLoading || isUpdating}
                        error={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="domisili"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        ref={field.ref}
                        label="Domicile *"
                        options={domicileOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Domicile"
                        disabled={domicileLoading || isUpdating}
                        error={error?.message}
                      />
                    )}
                  />
                  {watchedDomicile === 'other' && (
                    <TextField
                      id="domisili_other"
                      label="Domicile Name *"
                      placeholder="Enter your domicile name"
                      {...register('domisili_other')}
                      disabled={isUpdating}
                      required
                    />
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center"
                      disabled={isUpdating}>
                      {isUpdating && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />}
                      Save
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateBioModal;
