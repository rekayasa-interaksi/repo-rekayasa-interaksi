import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/authContext';
import { useFeedbackEvent } from '../../hooks/event.hooks';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import '../../assets/styles/index.css';
import { TextField } from '../ui/Textfield';
import { Dropdown } from '../ui/Dropdown';
import { StarRating } from '../ui/StarRating';
import { CustomImageUpload } from '../ui/CustomImageUpload';
import { SegmentedControl } from '../ui/SegmentedControl';

const FeedbackModal = ({ isOpen, onClose, event }) => {
  const { isAuthenticated } = useAuth();
  const { execute, isLoading: isFeedbackLoading, error: feedbackError } = useFeedbackEvent();

  const [feedbackableEvents, setFeedbackableEvents] = useState([]);
  const [selectedDetailEventId, setSelectedDetailEventId] = useState('');

  const [form, setForm] = useState({
    materialQuality: 0,
    deliveryQuality: 0,
    duration: '',
    nextTopic: '',
    feedback: '',
    image: null
  });

  useEffect(() => {
    if (isOpen) {
      if (event?.detail_events) {
        const eligibleEvents = event.detail_events.filter((de) => de.is_joined === false);
        setFeedbackableEvents(eligibleEvents);

        if (eligibleEvents.length === 1) {
          setSelectedDetailEventId(eligibleEvents[0].id);
        } else {
          setSelectedDetailEventId('');
        }
      } else {
        setFeedbackableEvents(null);
      }
    } else {
      setForm({
        materialQuality: 0,
        deliveryQuality: 0,
        duration: '',
        nextTopic: '',
        feedback: '',
        image: null
      });
      setFeedbackableEvents(null);
      setSelectedDetailEventId('');
    }
  }, [isOpen, event]);

  const handleFormChange = (field) => (valueOrEvent) => {
    let newValue;

    if (valueOrEvent && valueOrEvent.target) {
      newValue = field === 'image' ? valueOrEvent.target.files[0] : valueOrEvent.target.value;
    } else {
      newValue = valueOrEvent;
    }

    setForm((prev) => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('You must be logged in to submit feedback.');
      onClose();
      return;
    }

    if (!selectedDetailEventId) {
      toast.error('Please select an event session to give feedback for.');
      return;
    }

    if (
      form.materialQuality === 0 ||
      form.deliveryQuality === 0 ||
      form.duration.trim() === '' ||
      form.nextTopic.trim() === '' ||
      form.feedback.trim() === '' ||
      form.image === null
    ) {
      toast.error('Please fill out all required fields.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('detail_event_id', selectedDetailEventId);

      payload.append('material_quality', form.materialQuality);
      payload.append('delivery_quality', form.deliveryQuality);
      payload.append('duration', form.duration);
      payload.append('next_topic', form.nextTopic);
      payload.append('suggest', form.feedback);
      payload.append('image', form.image);

      await execute(payload);
      toast.success('Thank you for your feedback!');
      onClose();
    } catch (err) {
      toast.error(`Failed to submit feedback: ${err.data.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[500] flex justify-center items-center"
        onClose={onClose}>
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
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <DialogPanel
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative overflow-y-auto max-h-[95vh] scrollbar-hide"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold mb-1 text-primary">Event Feedback Form</h2>
            <p className="mb-4">{format(new Date(), 'd MMMM yyyy', { locale: id })}</p>

            <div className="border-t border-gray-300 my-4"></div>
            {isAuthenticated ? (
              feedbackableEvents === null ? (
                <div className="text-center py-4">
                  <p className="text-gray-700">Loading sessions...</p>
                </div>
              ) : feedbackableEvents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-700">
                    You have already submitted feedback for all sessions of this event.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {feedbackableEvents.length > 1 && (
                    <div>
                      <Dropdown
                        label="Select Session*"
                        options={feedbackableEvents.map((de) => ({
                          value: de.id,
                          label: `${de.title} (on ${de.date})`
                        }))}
                        placeholder="Select an event session"
                        value={selectedDetailEventId}
                        onValueChange={setSelectedDetailEventId}
                        disabled={isFeedbackLoading}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-sm mb-2">Material Quality*</label>
                      <StarRating
                        value={form.materialQuality}
                        onChange={handleFormChange('materialQuality')}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-sm mb-2">Delivery Quality*</label>
                      <StarRating
                        value={form.deliveryQuality}
                        onChange={handleFormChange('deliveryQuality')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">Duration*</label>
                    <SegmentedControl
                      value={form.duration}
                      onChange={handleFormChange('duration')}
                      options={[
                        { value: 'slow', label: 'Slow' },
                        { value: 'fit', label: 'Fit' },
                        { value: 'fast', label: 'Fast' }
                      ]}
                    />
                  </div>
                  <TextField
                    id="nextTopic"
                    label="Next Topic*"
                    value={form.nextTopic}
                    onChange={handleFormChange('nextTopic')}
                  />
                  <TextField
                    id="feedback"
                    label="Feedback / Suggestions*"
                    multiline
                    rows={4}
                    value={form.feedback}
                    onChange={handleFormChange('feedback')}
                  />
                  <div className="w-1/2">
                    <CustomImageUpload
                      id="image"
                      label="Upload Image (Max 1MB)*"
                      onChange={handleFormChange('image')}
                      currentImage={form.image}
                      maxFileSize={1048576}
                      allowedTypes={['image/jpeg', 'image/png']}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isFeedbackLoading || !selectedDetailEventId}
                    className={`w-full bg-primary text-white text-sm font-medium py-2 rounded-full hover:bg-secondary-dark transition-all duration-300 transform hover:scale-105 ${
                      (isFeedbackLoading || !selectedDetailEventId) &&
                      'opacity-50 cursor-not-allowed'
                    }`}>
                    {isFeedbackLoading ? 'Submitting...' : 'Submit'}
                  </button>
                  {feedbackError && (
                    <p className="text-sm text-red-500 mt-2">{feedbackError.data.message}</p>
                  )}
                </form>
              )
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-700 mb-4">You must be logged in to provide feedback.</p>
                <Link to="/login" className="text-primary underline">
                  Login
                </Link>
              </div>
            )}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default FeedbackModal;
