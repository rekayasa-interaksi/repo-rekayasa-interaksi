import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const routeNameMap = {
  event: 'Events',
  detail: 'Detail Event'
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-700 mb-4">
      <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:underline">
        <FontAwesomeIcon icon={faHome} className="text-lg" />
      </Link>

      {pathnames.map((segment, index) => {
        const isLast = index === pathnames.length - 1;
        const routeTo = '/' + pathnames.slice(0, index + 1).join('/');

        return (
          <React.Fragment key={segment}>
            <span className="mx-1 text-gray-500">
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </span>
            {isLast ? (
              <span className="text-secondary font-medium">{routeNameMap[segment] || segment}</span>
            ) : (
              <Link to={routeTo} className="text-gray-700 hover:underline">
                {routeNameMap[segment] || segment}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
