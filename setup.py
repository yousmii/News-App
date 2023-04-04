""""
TODO: istall setup.py to fix relative import problems
pip install -e .
(-e for editable)
"""
from distutils.core import setup

setup(name='News-App',
      version='1.0',
      description='News-App created for PPBD',
      author='Team 2',
      url='https://www.python.org/sigs/distutils-sig/',
      packages=['src']
     )