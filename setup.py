""""
TODO: istall setup.py to fix relative import problems
pip install -e .
(-e for editable)

"""

from distutils.core import setup
from setuptools import find_packages

setup(name='News-App',
      version='1.0',
      description='source of News-App created for PPBD',
      author='Team 2',
      url='https://github.com/yousmii/News-App/tree/main/src',
      packages=find_packages(include=['src', 'src.*'])
     )