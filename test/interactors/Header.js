import { createInteractor } from '@bigtest/interactor';

export default createInteractor('header')({
  selector: 'h1, h2, h3, h4, h5, h6'
});