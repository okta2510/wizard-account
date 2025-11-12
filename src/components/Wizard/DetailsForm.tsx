"use client";
import React from 'react';
import Autocomplete from '../Shared/Autocomplete';

export default function DetailsForm() {
  return (
    <form>
      <label>
        Department
        <Autocomplete options={["Engineering","Operations","HR"]} />
      </label>
      <br />
      <label>
        Bio
        <textarea name="bio" />
      </label>
    </form>
  );
}
